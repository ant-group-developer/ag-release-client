'use client';
import DndUpload from '@/components/ui/input/dnd-upload';
import { TYPE_UPLOAD_BUCKET } from '@/enums/common';
import extractAudioMetadata, { getPeakData } from '@/helpers/common';
import { showNotification } from '@/helpers/messages-helper';
import { useReleaseFormStore } from '@/modules/releases/hooks/release-form-store';
import { useCreateTrackDraft } from '@/modules/tracks/hooks/use-create-track-draft';
import { bucketApi } from '@/modules/upload/apis/bucket-api';
import { AudioFileBucket, CreateBucketFile } from '@/modules/upload/types/data';
import { Progress, UploadProps } from 'antd';
import axios from 'axios';
import { useTranslations } from 'next-intl';
import { useRef, useState } from 'react';

interface Props extends UploadProps {}

interface TracksPayload extends UploadProps {
    title: string;
    releaseId: string;
    audioFileDraft: AudioFileBucket;
    key: string;
    order: number;
}

interface UploadProgress {
    fileName: string;
    progress: number;
    key: string;
}

export default function DropUploadTracks({ ...props }: Props) {
    const formValues = useReleaseFormStore((s) => s.formValues);
    const { createTrackDraft } = useCreateTrackDraft();
    const [uploadProgress, setUploadProgress] = useState<UploadProgress[]>([]);
    const messages = useTranslations();
    const prevLength = useRef(0);

    // Validate file and audio metadata
    const validateFile = (fileOriginal: any, metadata: any): boolean => {
        // Check file name length
        if (fileOriginal.name.length > 80) {
            showNotification(
                'error',
                messages('track.validation.trackFileName', { number: 80 })
            );
            return false;
        }

        // Check audio metadata
        if (metadata?.bitDepth !== 16 || metadata?.sampleRate !== 44100) {
            const reasons: string[] = [];
            if (metadata.bitDepth !== 16)
                reasons.push(messages('track.validation.bitDepth16'));
            if (metadata.sampleRate !== 44100)
                reasons.push(messages('track.validation.sampleRate44100'));

            showNotification(
                'error',
                `${fileOriginal.name}: ${reasons.join(', ')}`,
                { autoClose: 4000 }
            );
            return false;
        }

        return true;
    };

    // Create bucket file infos for track and peak
    const createBucketInfos = (
        fileOriginal: any,
        file: any,
        peakData: number[],
        index: number
    ): [CreateBucketFile, CreateBucketFile] => {
        const fileNameWithoutExtension =
            fileOriginal.name.lastIndexOf('.') !== -1
                ? fileOriginal.name.substring(
                      0,
                      fileOriginal.name.lastIndexOf('.')
                  )
                : fileOriginal.name;

        // Track bucket info
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

        // Peak file and bucket info
        const peakJson = JSON.stringify(peakData);
        const peakBlob = new Blob([peakJson], { type: 'application/json' });
        const peakFile = new File(
            [peakBlob],
            fileOriginal.name.replace(/\.\w+$/, '.json'),
            { type: 'application/json' }
        );

        const peakInfo: CreateBucketFile = {
            folderBucket: {
                releaseId: formValues.id ?? '',
                uploadPurpose: TYPE_UPLOAD_BUCKET.TRACK,
                trackFileName: fileNameWithoutExtension,
            },
            file: {
                fileName: peakFile.name,
                contentType: peakFile.type,
                extension: 'json',
                fileSize: peakFile.size,
            },
            key: `peak-${index}`,
        };

        return [trackInfo, peakInfo];
    };

    // Process single file
    const processFile = async (
        file: any,
        index: number,
        tracksPayload: TracksPayload[],
        temp: { file: any; key: string }[]
    ): Promise<CreateBucketFile[] | void> => {
        const fileOriginal = file.originFileObj;

        let songDuration = 0;
        let peakData: number[] = [];

        if (fileOriginal) {
            const { peakData: data, songDuration: duration } =
                await getPeakData(file.originFileObj);
            if (!data) return;
            peakData = data;
            songDuration = duration;
        }

        const metadata = await extractAudioMetadata(file.originFileObj);

        // Validate file
        if (!validateFile(fileOriginal, metadata)) return;

        // Create bucket infos
        const [trackInfo, peakInfo] = createBucketInfos(
            fileOriginal,
            file,
            peakData,
            index
        );

        // Create peak file for upload
        const peakJson = JSON.stringify(peakData);
        const peakBlob = new Blob([peakJson], { type: 'application/json' });
        const peakFile = new File(
            [peakBlob],
            fileOriginal.name.replace(/\.\w+$/, '.json'),
            { type: 'application/json' }
        );

        // Add to tracks payload
        const fileNameWithoutExtension =
            fileOriginal.name.lastIndexOf('.') !== -1
                ? fileOriginal.name.substring(
                      0,
                      fileOriginal.name.lastIndexOf('.')
                  )
                : fileOriginal.name;

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

        // Add to temp storage
        temp.push({ file: file, key: `track-${index}` });
        temp.push({ file: peakFile, key: `peak-${index}` });

        return [trackInfo, peakInfo];
    };

    // Handle progress updates
    const manageProgress = {
        initialize: (files: any[]) => {
            const preparingProgress: UploadProgress[] = files.map(
                (file: any, index: number) => ({
                    fileName:
                        file.name ||
                        file.originFileObj?.name ||
                        `File ${index + 1}`,
                    progress: 0,
                    key: `track-${index}`,
                })
            );
            setUploadProgress(preparingProgress);
        },

        updateAfterBucketCreation: (
            bucketResponse: any[],
            temp: { file: any; key: string }[]
        ) => {
            const initialProgress: UploadProgress[] = [];
            bucketResponse.forEach((item: any) => {
                if (item.key.startsWith('track-')) {
                    const matchedFile = temp.find((i) =>
                        item.key.includes(i.key)
                    );
                    if (matchedFile) {
                        initialProgress.push({
                            fileName:
                                matchedFile.file.name ||
                                matchedFile.file.originFileObj?.name ||
                                item.key,
                            progress: 0,
                            key: item.key,
                        });
                    }
                }
            });
            setUploadProgress(initialProgress);
        },

        updateUploadProgress: (key: string, progress: number) => {
            setUploadProgress((prev) =>
                prev.map((p) => (p.key === key ? { ...p, progress } : p))
            );
        },

        reset: () => {
            setUploadProgress([]);
        },
    };

    // Upload files and map IDs
    const uploadAndMapFiles = async (
        bucketResponse: any[],
        temp: { file: any; key: string }[],
        tracksPayload: TracksPayload[]
    ) => {
        // Upload files
        const uploadPromises = bucketResponse.map(async (item: any) => {
            const matchedFile = temp.find((i) => item.key.includes(i.key));
            if (!matchedFile) return;

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
                        const percentCompleted = Math.round(
                            (progressEvent.loaded * 100) /
                                (progressEvent.total || 1)
                        );
                        manageProgress.updateUploadProgress(
                            item.key,
                            percentCompleted
                        );
                    },
                }
            );

            if (!uploadResponse.status || uploadResponse.status >= 400) {
                throw new Error(
                    `Failed to upload file. Please try again later.`
                );
            }
        });

        await Promise.all(uploadPromises);

        // Map file IDs to tracks
        bucketResponse.forEach((item: any) => {
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
        });
    };

    const handleUpload = async (files: any[]) => {
        try {
            manageProgress.initialize(files);

            const tracksPayload: TracksPayload[] = [];
            const temp: { file: any; key: string }[] = [];

            // keep order of files
            const newTracks: CreateBucketFile[] = [];
            for (let index = 0; index < files.length; index++) {
                const result = await processFile(
                    files[index],
                    index,
                    tracksPayload,
                    temp
                );
                if (result) newTracks.push(...result);
            }

            // Create buckets and upload files
            const response = await bucketApi.createBuckets({
                bucketDtos: newTracks,
            });
            manageProgress.updateAfterBucketCreation(response.data, temp);
            await uploadAndMapFiles(response.data, temp, tracksPayload);

            // Submit files
            await bucketApi.submit({
                ids: response.data.map((item: any) => item.fileId),
            });

            // Create track drafts — sort theo order để chắc chắn
            createTrackDraft({
                payload: tracksPayload.sort((a, b) => a.order - b.order),
            });
        } catch (error) {
            manageProgress.reset();
            showNotification(
                'error',
                messages('file.message.uploadFileFailed')
            );
        }
    };

    return (
        <div>
            {uploadProgress?.length < 1 && (
                <DndUpload
                    {...props}
                    multiple
                    accept="audio/wav"
                    onChange={({ fileList }) => {
                        if (fileList.length > prevLength.current) {
                            handleUpload(fileList);
                        }
                        prevLength.current = fileList.length;
                    }}
                    maxCount={50}
                />
            )}

            {uploadProgress.map((p) => (
                <div key={p.key} className="mt-2 flex flex-col justify-start">
                    <span className="text-left">{p.fileName}</span>
                    <Progress percent={p.progress} size="small" />
                </div>
            ))}
        </div>
    );
}
