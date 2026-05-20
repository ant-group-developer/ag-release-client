import { TYPE_UPLOAD_BUCKET } from '@/enums/common';
import extractAudioMetadata from '@/helpers/common';
import { showNotification } from '@/helpers/messages-helper';
import { useActive } from '@/hooks/use-active';
import { useReleaseFormStore } from '@/modules/releases/hooks/release-form-store';
import { useCreateTrackDraft } from '@/modules/tracks/hooks/use-create-track-draft';
import { TrackPayload } from '@/modules/tracks/types/payload';
import { bucketApi } from '@/modules/upload/apis/bucket-api';
import { AudioFileBucket, CreateBucketFile } from '@/modules/upload/types/data';
import { CreateVariables } from '@/types/api';
import axios from 'axios';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface TracksPayload {
    title: string;
    releaseId: string;
    audioFileDraft: AudioFileBucket;
    key: string;
    order: number;
}

export interface UploadProgress {
    fileName: string;
    progress: number;
    key: string;
}

interface HandleUploadCallbacks {
    onSuccess?: () => void;
    onError?: () => void;
}

export function useTrackUpload() {
    const messages = useTranslations();
    const formValues = useReleaseFormStore((state) => state.formValues);
    const { createTrackDraft } = useCreateTrackDraft();
    const [uploadProgress, setUploadProgress] = useState<UploadProgress[]>([]);
    const { isActive, deActive, active } = useActive();

    const stripExtension = (fileName: string) =>
        fileName.lastIndexOf('.') !== -1
            ? fileName.substring(0, fileName.lastIndexOf('.'))
            : fileName;

    // ─── Step 1: Validate file

    const validateFile = (fileOriginal: any, metadata: any): boolean => {
        if (fileOriginal.name.length > 500) {
            showNotification(
                'error',
                messages('track.validation.trackFileName', { number: 500 })
            );
            return false;
        }

        const bitDepth = metadata?.bitDepth;
        const sampleRate = metadata?.sampleRate;

        const isValid =
            (bitDepth === 16 && sampleRate === 44100) ||
            (bitDepth === 24 && sampleRate === 48000);

        if (!isValid) {
            const reasons: string[] = [];
            if (bitDepth !== 16 && bitDepth !== 24) {
                reasons.push(messages('track.validation.bitDepth16Or24'));
            }
            if (sampleRate !== 44100 && sampleRate !== 48000) {
                reasons.push(messages('track.validation.sampleRate44100Or48000'));
            }

            if (reasons.length === 0) {
                reasons.push(messages('track.validation.invalidAudioCombination'));
            }

            showNotification(
                'error',
                `${fileOriginal.name}: ${reasons.join(', ')}`,
                { autoClose: 4000 }
            );
            return false;
        }

        return true;
    };

    // ─── Step 2: Build bucket data for one file

    const buildTrackBucketData = async (
        file: any,
        index: number,
        tracksPayload: TracksPayload[],
        temp: { file: any; key: string }[]
    ): Promise<CreateBucketFile | undefined> => {
        const fileOriginal = file.originFileObj;
        if (!fileOriginal) return;

        const metadata = await extractAudioMetadata(fileOriginal);
        if (!validateFile(fileOriginal, metadata)) return;

        const fileNameWithoutExtension = stripExtension(fileOriginal.name);

        const trackInfo: CreateBucketFile = {
            folderBucket: {
                releaseId: formValues.id ?? '',
                uploadPurpose: TYPE_UPLOAD_BUCKET.TRACK,
                trackFileName: fileNameWithoutExtension,
            },
            file: {
                fileName: fileOriginal.name,
                contentType: fileOriginal.type,
                extension: fileOriginal.name.split('.').pop(),
                fileSize: file.size,
            },
            key: `track-${index}`,
        };

        tracksPayload.push({
            title: fileNameWithoutExtension,
            releaseId: formValues.id as string,
            audioFileDraft: {
                sampleRate: metadata.sampleRate.toString(),
                bitDepth: metadata.bitDepth,
                duration: metadata.duration,
                bitrate: metadata.bitrate.toString(),
                trackId: null,
                fileId: null,
                peakId: null,
                preview: null,
                sampleLength: null,
            },
            key: `track-${index}`,
            order: index,
        });

        temp.push({ file, key: `track-${index}` });

        return trackInfo;
    };

    // ─── Step 3: Init progress bars

    const initUploadProgress = (
        bucketItems: any[],
        temp: { file: any; key: string }[]
    ): UploadProgress[] => {
        return bucketItems
            .filter((item) => item.key.startsWith('track-'))
            .flatMap((item) => {
                const matched = temp.find((i) => item.key === i.key);
                if (!matched) return [];
                return [
                    {
                        fileName:
                            matched.file.originFileObj?.name ||
                            matched.file.name ||
                            item.key,
                        progress: 0,
                        key: item.key,
                    },
                ];
            });
    };

    // ─── Step 4: Upload one file + update progress + assign fileIds

    const uploadOneBucketItem = async (
        item: any,
        temp: { file: any; key: string }[],
        tracksPayload: TracksPayload[]
    ) => {
        const matchedFile = temp.find((i) => item.key === i.key);

        if (matchedFile) {
            const fileToUpload =
                matchedFile.file.originFileObj ?? matchedFile.file;

            const uploadResponse = await axios.put(
                item.urlUpload,
                fileToUpload,
                {
                    headers: {
                        'Content-Type':
                            matchedFile.file.type || 'application/octet-stream',
                    },
                    onUploadProgress: (progressEvent) => {
                        const percent = Math.round(
                            (progressEvent.loaded * 100) /
                                (progressEvent.total || 1)
                        );
                        setUploadProgress((prev) =>
                            prev.map((p) =>
                                p.key === item.key
                                    ? { ...p, progress: percent }
                                    : p
                            )
                        );
                    },
                }
            );

            if (!uploadResponse.status || uploadResponse.status >= 400) {
                throw new Error(
                    'Failed to upload file. Please try again later.'
                );
            }
        }

        // Assign fileId back to the matching payload entry
        if (item.key.startsWith('peak-')) {
            const index = item.key.split('-')[1];
            const track = tracksPayload.find(
                (tp) => tp.key === `track-${index}`
            );
            if (track) track.audioFileDraft.peakId = item.fileId;
        } else if (item.key.startsWith('track-')) {
            const track = tracksPayload.find((tp) => tp.key === item.key);
            if (track) track.audioFileDraft.fileId = item.fileId;
        }
    };

    // ─── Step 5: Save track drafts via API

    const saveTrackDrafts = (
        tracksPayload: TracksPayload[],
        callbacks?: HandleUploadCallbacks
    ) => {
        const variables: CreateVariables<TrackPayload[]> = {
            payload: tracksPayload.sort((a, b) => a.order - b.order),
            onSuccess: () => {
                setUploadProgress([]);
                callbacks?.onSuccess?.();
            },
            onError: () => {
                setUploadProgress([]);
                callbacks?.onError?.();
            },
        };
        createTrackDraft(variables);
    };

    // ─── Main entry point

    const handleUpload = async (
        files: any[],
        callbacks?: HandleUploadCallbacks
    ) => {
        active();
        try {
            const tracksPayload: TracksPayload[] = [];
            const temp: { file: any; key: string }[] = [];

            // Step 1 – build bucket metadata for all files
            const newTracksRaw = await Promise.all(
                files.map((file: any, index: number) =>
                    buildTrackBucketData(file, index, tracksPayload, temp)
                )
            );

            const newTracks = newTracksRaw
                .map((result, index) => ({ result, index }))
                .filter(({ result }) => Boolean(result))
                .sort((a, b) => a.index - b.index)
                .flatMap(({ result }) => result!);

            if (newTracks.length === 0) {
                callbacks?.onError?.();
                return;
            }

            // Step 2 – create pre-signed upload URLs
            const response = await bucketApi.createBuckets({
                bucketDtos: newTracks,
            });

            // Step 3 – show progress bars
            setUploadProgress(initUploadProgress(response.data, temp));

            // Step 4 – upload files and assign fileIds
            await Promise.all(
                response.data.map((item: any) =>
                    uploadOneBucketItem(item, temp, tracksPayload)
                )
            );

            // Step 5 – mark files as submitted
            await bucketApi.submit({
                ids: response.data.map((item: any) => item.fileId),
            });

            // Step 6 – persist track drafts
            saveTrackDrafts(tracksPayload, callbacks);
        } catch {
            setUploadProgress([]);
            showNotification(
                'error',
                messages('file.message.uploadFileFailed')
            );
            callbacks?.onError?.();
        } finally {
            deActive();
        }
    };

    return {
        uploadProgress,
        handleUpload,
        pending: isActive,
    };
}
