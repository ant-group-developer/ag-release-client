import { TYPE_UPLOAD_BUCKET } from '@/enums/common';
import extractAudioMetadata from '@/helpers/common';
import { showNotification } from '@/helpers/messages-helper';
import { useActive } from '@/hooks/use-active';
import { useReplaceTrackAudio } from '@/modules/tracks/hooks/use-replace-track-audio';
import { bucketApi } from '@/modules/upload/apis/bucket-api';
import { CreateBucketFile } from '@/modules/upload/types/data';
import axios from 'axios';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

export interface ReplaceUploadProgress {
    fileName: string;
    progress: number;
}

interface ReplaceCallbacks {
    onSuccess?: () => void;
    onError?: () => void;
}

export function useTrackReplace() {
    const messages = useTranslations();
    const { replaceTrackAudioAsync } = useReplaceTrackAudio();
    const [uploadProgress, setUploadProgress] = useState<ReplaceUploadProgress | null>(null);
    const { isActive, deActive, active } = useActive();

    const stripExtension = (fileName: string) =>
        fileName.lastIndexOf('.') !== -1
            ? fileName.substring(0, fileName.lastIndexOf('.'))
            : fileName;

    // ─── Step 1: Validate file & metadata ──────────────────────────────────────────
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

    // ─── Main handler: Replace Track Audio ─────────────────────────────────────────
    const handleReplace = async (
        fileInput: any,
        trackId: string,
        releaseId: string,
        callbacks?: ReplaceCallbacks
    ) => {
        const fileOriginal = fileInput?.originFileObj ?? fileInput;
        if (!fileOriginal) return;

        active();
        try {
            // Step 1: Extract & Validate metadata
            const metadata = await extractAudioMetadata(fileOriginal);
            if (!validateFile(fileOriginal, metadata)) {
                callbacks?.onError?.();
                return;
            }

            const fileNameWithoutExtension = stripExtension(fileOriginal.name);

            // Step 2: Build bucket data
            const trackBucketInfo: CreateBucketFile = {
                folderBucket: {
                    releaseId: releaseId || '',
                    uploadPurpose: TYPE_UPLOAD_BUCKET.TRACK,
                    trackFileName: fileNameWithoutExtension,
                },
                file: {
                    fileName: fileOriginal.name,
                    contentType: fileOriginal.type,
                    extension: fileOriginal.name.split('.').pop(),
                    fileSize: fileOriginal.size,
                },
                key: `replace-track-${trackId}`,
            };

            // Step 3: Create presigned upload URL
            const response = await bucketApi.createBuckets({
                bucketDtos: [trackBucketInfo],
            });

            const bucketItem = response?.data?.[0];
            if (!bucketItem || !bucketItem.urlUpload) {
                throw new Error('Failed to generate upload URL');
            }

            setUploadProgress({
                fileName: fileOriginal.name,
                progress: 0,
            });

            // Step 4: Upload file to storage with progress tracking
            const uploadResponse = await axios.put(
                bucketItem.urlUpload,
                fileOriginal,
                {
                    headers: {
                        'Content-Type':
                            fileOriginal.type || 'application/octet-stream',
                    },
                    onUploadProgress: (progressEvent) => {
                        const percent = Math.round(
                            (progressEvent.loaded * 100) /
                                (progressEvent.total || 1)
                        );
                        setUploadProgress({
                            fileName: fileOriginal.name,
                            progress: percent,
                        });
                    },
                }
            );

            if (!uploadResponse.status || uploadResponse.status >= 400) {
                throw new Error(
                    'Failed to upload file. Please try again later.'
                );
            }

            // Step 5: Mark bucket file as submitted
            await bucketApi.submit({
                ids: [bucketItem.fileId],
            });

            // Step 6: Update track audio via backend API
            await replaceTrackAudioAsync({
                id: trackId,
                payload: {
                    fileId: bucketItem.fileId,
                    sampleRate: metadata.sampleRate.toString(),
                    bitDepth: metadata.bitDepth,
                    bitrate: metadata.bitrate,
                    duration: metadata.duration,
                },
            });

            setUploadProgress(null);
            callbacks?.onSuccess?.();
        } catch {
            setUploadProgress(null);
            showNotification(
                'error',
                messages('file.message.uploadFileFailed')
            );
            callbacks?.onError?.();
        } finally {
            deActive();
        }
    };

    const resetUpload = () => {
        setUploadProgress(null);
        deActive();
    };

    return {
        uploadProgress,
        handleReplace,
        pending: isActive,
        resetUpload,
    };
}
