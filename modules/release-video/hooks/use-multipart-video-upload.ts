import { TYPE_UPLOAD_BUCKET } from '@/enums/common';
import { useUpdateReleaseDraft } from '@/modules/releases/hooks/use-update-release-draft';
import { bucketApi } from '@/modules/upload/apis/bucket-api';
import {
    MultipartUploadProgress,
    uploadMultipartFile,
} from '@/modules/upload/services/multipart-uploader';
import {
    UploadedPart,
    VideoUploadResumeDescriptor,
} from '@/modules/upload/types/data';
import { createFileFingerprint } from '@/modules/upload/utils/multipart-file';
import { useCallback, useEffect, useRef, useState } from 'react';

export type UploadPhase =
    | 'idle'
    | 'initiating'
    | 'uploading'
    | 'completing'
    | 'saving'
    | 'completed'
    | 'canceling'
    | 'failed';

export interface UploadError {
    code: string;
    message?: string;
    originalError?: any;
}

export interface UseMultipartVideoUploadOptions {
    releaseId?: string;
    onCompleted?: (result: {
        fileId: string;
        readUrl: string;
        file: File;
    }) => void;
    onError?: (error: UploadError) => void;
}

const STORAGE_PREFIX = 'ag_video_multipart_';
export const MAX_VIDEO_SIZE = 30 * 1024 * 1024 * 1024; // 30 GiB

export function getResumeDescriptorKey(releaseId: string): string {
    return `${STORAGE_PREFIX}${releaseId}`;
}

export function loadResumeDescriptor(
    releaseId?: string
): VideoUploadResumeDescriptor | null {
    if (!releaseId || typeof window === 'undefined') return null;
    try {
        const raw = localStorage.getItem(getResumeDescriptorKey(releaseId));
        if (!raw) return null;
        const descriptor: VideoUploadResumeDescriptor = JSON.parse(raw);
        if (
            descriptor.expiresAt &&
            new Date(descriptor.expiresAt).getTime() <= Date.now()
        ) {
            localStorage.removeItem(getResumeDescriptorKey(releaseId));
            return null;
        }
        return descriptor;
    } catch {
        return null;
    }
}

export function saveResumeDescriptor(
    descriptor: VideoUploadResumeDescriptor
): void {
    if (typeof window === 'undefined') return;
    try {
        localStorage.setItem(
            getResumeDescriptorKey(descriptor.releaseId),
            JSON.stringify(descriptor)
        );
    } catch (e) {
        console.warn('Failed to persist multipart upload descriptor', e);
    }
}

export function clearResumeDescriptor(releaseId?: string): void {
    if (!releaseId || typeof window === 'undefined') return;
    try {
        localStorage.removeItem(getResumeDescriptorKey(releaseId));
    } catch {}
}

export function useMultipartVideoUpload({
    releaseId,
    onCompleted,
    onError,
}: UseMultipartVideoUploadOptions) {
    const [phase, setPhase] = useState<UploadPhase>('idle');
    const [percent, setPercent] = useState<number>(0);
    const [speed, setSpeed] = useState<number>(0);
    const [completedParts, setCompletedParts] = useState<number>(0);
    const [partCount, setPartCount] = useState<number>(0);
    const [loaded, setLoaded] = useState<number>(0);
    const [total, setTotal] = useState<number>(0);
    const [file, setFile] = useState<File | null>(null);
    const [fileId, setFileId] = useState<string | null>(null);
    const [error, setError] = useState<UploadError | null>(null);
    const [resumeDescriptor, setResumeDescriptor] =
        useState<VideoUploadResumeDescriptor | null>(null);

    const abortControllerRef = useRef<AbortController | null>(null);
    const currentPartsRef = useRef<UploadedPart[]>([]);
    const readUrlRef = useRef<string>('');
    const { updateReleaseDraft } = useUpdateReleaseDraft();

    // Check for saved descriptor on mount or when releaseId changes
    useEffect(() => {
        if (!releaseId) return;
        const saved = loadResumeDescriptor(releaseId);
        if (saved) {
            setResumeDescriptor(saved);
            setFileId(saved.fileId);
            setPartCount(saved.partCount);
            setTotal(saved.fileSize);
        } else {
            setResumeDescriptor(null);
        }
    }, [releaseId]);

    const handleProgress = useCallback((p: MultipartUploadProgress) => {
        setLoaded(p.loaded);
        setTotal(p.total);
        setPercent(p.percent);
        setSpeed(p.speed);
        setCompletedParts(p.completedParts);
        setPartCount(p.partCount);
    }, []);

    const executeDraftUpdate = useCallback(
        (targetFileId: string, uploadedFile: File, targetReadUrl: string) => {
            if (!releaseId) return;
            setPhase('saving');

            updateReleaseDraft({
                id: releaseId,
                payload: {
                    video: {
                        fileId: targetFileId,
                    },
                },
                onSuccess: () => {
                    clearResumeDescriptor(releaseId);
                    setResumeDescriptor(null);
                    setPhase('completed');
                    setPercent(100);
                    onCompleted?.({
                        fileId: targetFileId,
                        readUrl: targetReadUrl,
                        file: uploadedFile,
                    });
                },
                onError: (draftError: any) => {
                    const err: UploadError = {
                        code: 'SAVE_DRAFT_FAILED',
                        message: 'uploadedButNotSaved',
                        originalError: draftError,
                    };
                    setError(err);
                    setPhase('failed');
                    onError?.(err);
                },
            });
        },
        [releaseId, updateReleaseDraft, onCompleted, onError]
    );

    const executeUploadProcess = useCallback(
        async (
            targetFile: File,
            targetFileId: string,
            targetPartSize: number,
            targetPartCount: number,
            existingParts: UploadedPart[] = []
        ) => {
            abortControllerRef.current = new AbortController();
            const signal = abortControllerRef.current.signal;

            try {
                // 1. Upload parts
                setPhase('uploading');
                const sortedParts = await uploadMultipartFile({
                    file: targetFile,
                    fileId: targetFileId,
                    partSize: targetPartSize,
                    partCount: targetPartCount,
                    existingParts,
                    signal,
                    onProgress: handleProgress,
                });
                currentPartsRef.current = sortedParts;

                // 2. Complete multipart on R2
                setPhase('completing');
                setPercent(100);
                const completeRes = await bucketApi.completeMultipart(
                    targetFileId,
                    sortedParts
                );
                readUrlRef.current = completeRes.readUrl;

                // Mark descriptor as completed so retry only updates draft
                if (releaseId) {
                    const desc = loadResumeDescriptor(releaseId);
                    if (desc) {
                        saveResumeDescriptor({ ...desc, completed: true });
                    }
                }

                // 3. Submit fileId to backend
                setPhase('saving');
                await bucketApi.submit({ ids: [targetFileId] });

                // 4. Update draft
                executeDraftUpdate(
                    targetFileId,
                    targetFile,
                    completeRes.readUrl
                );
            } catch (err: any) {
                if (signal.aborted || err?.name === 'AbortError') {
                    return;
                }

                console.error('Multipart upload error:', err);
                let errCode = 'UPLOAD_FAILED';
                const status = err?.response?.status;

                if (err?.message === 'MISSING_ETAG') {
                    errCode = 'MISSING_ETAG';
                } else if (status === 400) {
                    errCode = 'INVALID_PARTS';
                } else if (status === 403) {
                    errCode = 'FORBIDDEN';
                    clearResumeDescriptor(releaseId);
                } else if (status === 404) {
                    errCode = 'SESSION_NOT_FOUND';
                    clearResumeDescriptor(releaseId);
                } else if (status === 409) {
                    errCode = 'INVALID_STATE';
                } else if (status === 410) {
                    errCode = 'SESSION_EXPIRED';
                    clearResumeDescriptor(releaseId);
                } else if (status === 422) {
                    errCode = 'SIZE_MISMATCH';
                }

                const uploadErr: UploadError = {
                    code: errCode,
                    message: err?.message,
                    originalError: err,
                };
                setError(uploadErr);
                setPhase('failed');
                onError?.(uploadErr);
            }
        },
        [releaseId, handleProgress, executeDraftUpdate, onError]
    );

    const start = useCallback(
        async (selectedFile: File) => {
            if (!releaseId) return;

            // Validate
            if (!selectedFile.type.startsWith('video/')) {
                const err: UploadError = { code: 'INVALID_VIDEO_FILE' };
                setError(err);
                setPhase('failed');
                onError?.(err);
                return;
            }
            if (selectedFile.size > MAX_VIDEO_SIZE) {
                const err: UploadError = { code: 'MAX_SIZE_EXCEEDED' };
                setError(err);
                setPhase('failed');
                onError?.(err);
                return;
            }
            if (selectedFile.name.length > 500) {
                const err: UploadError = { code: 'FILE_NAME_TOO_LONG' };
                setError(err);
                setPhase('failed');
                onError?.(err);
                return;
            }

            setFile(selectedFile);
            setError(null);
            setPhase('initiating');
            setPercent(0);
            setSpeed(0);

            try {
                const initiateRes = await bucketApi.initiateMultipart({
                    folderBucket: {
                        releaseId,
                        uploadPurpose: TYPE_UPLOAD_BUCKET.VIDEO_FILE,
                    },
                    file: {
                        fileName: selectedFile.name,
                        contentType: selectedFile.type,
                        extension: selectedFile.name.split('.').pop() || '',
                        fileSize: selectedFile.size,
                    },
                });

                const descriptor: VideoUploadResumeDescriptor = {
                    releaseId,
                    fileId: initiateRes.fileId,
                    fingerprint: createFileFingerprint(selectedFile),
                    fileName: selectedFile.name,
                    fileSize: selectedFile.size,
                    partSize: initiateRes.partSize,
                    partCount: initiateRes.partCount,
                    expiresAt: String(initiateRes.expiresAt),
                    completed: false,
                };

                saveResumeDescriptor(descriptor);
                setResumeDescriptor(descriptor);
                setFileId(initiateRes.fileId);
                setPartCount(initiateRes.partCount);
                setTotal(selectedFile.size);

                await executeUploadProcess(
                    selectedFile,
                    initiateRes.fileId,
                    initiateRes.partSize,
                    initiateRes.partCount,
                    []
                );
            } catch (err: any) {
                console.error('Failed to initiate multipart upload:', err);
                const uploadErr: UploadError = {
                    code: 'INITIATION_FAILED',
                    message: err?.message,
                    originalError: err,
                };
                setError(uploadErr);
                setPhase('failed');
                onError?.(uploadErr);
            }
        },
        [releaseId, executeUploadProcess, onError]
    );

    const resume = useCallback(
        async (selectedFile: File) => {
            if (!releaseId) return;
            const desc = loadResumeDescriptor(releaseId);
            if (!desc) {
                const err: UploadError = { code: 'SESSION_NOT_FOUND' };
                setError(err);
                setPhase('failed');
                onError?.(err);
                return;
            }

            const currentFingerprint = createFileFingerprint(selectedFile);
            if (currentFingerprint !== desc.fingerprint) {
                const err: UploadError = { code: 'WRONG_RESUME_FILE' };
                setError(err);
                setPhase('failed');
                onError?.(err);
                return;
            }

            setFile(selectedFile);
            setError(null);

            // If already completed on R2 but draft saving failed
            if (desc.completed) {
                if (readUrlRef.current) {
                    executeDraftUpdate(
                        desc.fileId,
                        selectedFile,
                        readUrlRef.current
                    );
                } else {
                    try {
                        const readRes = await bucketApi.getLinkReadFile(
                            desc.fileId
                        );
                        readUrlRef.current = readRes.data?.data?.urlRead || '';
                        executeDraftUpdate(
                            desc.fileId,
                            selectedFile,
                            readUrlRef.current
                        );
                    } catch {
                        executeDraftUpdate(desc.fileId, selectedFile, '');
                    }
                }
                return;
            }

            // Fetch already uploaded parts from backend
            try {
                setPhase('initiating');
                const listRes = await bucketApi.listMultipartParts(desc.fileId);
                await executeUploadProcess(
                    selectedFile,
                    desc.fileId,
                    desc.partSize,
                    desc.partCount,
                    listRes.parts || []
                );
            } catch (err: any) {
                console.error('Failed to resume multipart upload:', err);
                const uploadErr: UploadError = {
                    code: 'RESUME_FAILED',
                    message: err?.message,
                    originalError: err,
                };
                setError(uploadErr);
                setPhase('failed');
                onError?.(uploadErr);
            }
        },
        [releaseId, executeUploadProcess, executeDraftUpdate, onError]
    );

    const retry = useCallback(async () => {
        if (!file && resumeDescriptor) {
            // Need user to re-select file if file is lost after refresh
            return;
        }

        if (error?.code === 'SAVE_DRAFT_FAILED' && file && fileId) {
            // Only retry save draft without re-uploading
            executeDraftUpdate(fileId, file, readUrlRef.current);
            return;
        }

        if (file && fileId && resumeDescriptor) {
            try {
                setPhase('initiating');
                const listRes = await bucketApi.listMultipartParts(fileId);
                await executeUploadProcess(
                    file,
                    fileId,
                    resumeDescriptor.partSize,
                    resumeDescriptor.partCount,
                    listRes.parts || []
                );
            } catch {
                if (file) {
                    await start(file);
                }
            }
            return;
        }

        if (file) {
            await start(file);
        }
    }, [file, fileId, resumeDescriptor, error, executeDraftUpdate, executeUploadProcess, start]);

    const cancel = useCallback(async () => {
        abortControllerRef.current?.abort();

        const currentFileId = fileId || resumeDescriptor?.fileId;
        if (currentFileId && phase !== 'completed') {
            setPhase('canceling');
            try {
                await bucketApi.abortMultipart(currentFileId);
            } catch (err) {
                console.warn('Failed to abort multipart on server:', err);
            }
        }

        clearResumeDescriptor(releaseId);
        setResumeDescriptor(null);
        setFile(null);
        setFileId(null);
        setError(null);
        setPercent(0);
        setSpeed(0);
        setCompletedParts(0);
        setPartCount(0);
        setLoaded(0);
        setTotal(0);
        setPhase('idle');
    }, [fileId, resumeDescriptor, phase, releaseId]);

    const reset = useCallback(() => {
        abortControllerRef.current?.abort();
        setPhase('idle');
        setFile(null);
        setFileId(null);
        setError(null);
        setPercent(0);
        setSpeed(0);
        setCompletedParts(0);
        setPartCount(0);
        setLoaded(0);
        setTotal(0);
    }, []);

    return {
        phase,
        percent,
        speed,
        completedParts,
        partCount,
        loaded,
        total,
        file,
        fileId,
        error,
        resumeDescriptor,
        canResume: Boolean(resumeDescriptor && !resumeDescriptor.completed),
        start,
        resume,
        retry,
        cancel,
        reset,
    };
}
