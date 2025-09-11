'use client';
import DndUpload from '@/components/ui/input/dnd-upload';
import { TYPE_UPLOAD_BUCKET } from '@/enums/common';
import extractAudioMetadata, { getPeakData } from '@/helpers/common';
import { showNotification } from '@/helpers/messages-helper';
import { useReleaseFormStore } from '@/modules/releases/hooks/release-form-store';
import { useCreateTrackDraft } from '@/modules/tracks/hooks/use-create-track-draft';
import { TrackPayload } from '@/modules/tracks/types/payload';
import { bucketApi } from '@/modules/upload/apis/bucket-api';
import { AudioFileBucket, CreateBucketFile } from '@/modules/upload/types/data';
import { CreateVariables } from '@/types/api';
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

    const handleUpload = async (files: any[]) => {
        const sortedFiles = [...files].sort((a, b) => {
            const nameA = (a.name || a.originFileObj?.name || '').toLowerCase();
            const nameB = (b.name || b.originFileObj?.name || '').toLowerCase();
            return nameA.localeCompare(nameB);
        });
        try {
            const preparingProgress: UploadProgress[] = sortedFiles.map(
                (file: any, index: number) => ({
                    fileName:
                        file.name ||
                        file.originFileObj?.name ||
                        `File ${index + 1}`,
                    progress: 0,
                    key: `track-${index}`,
                    status: 'preparing',
                })
            );
            setUploadProgress(preparingProgress);
            const tracksPayload: TracksPayload[] = [];

            // temp for handle store file and key
            const temp: { file: any; key: string }[] = [];

            const newTracksPromises = sortedFiles.map(
                async (file: any, index: number) => {
                    let songDuration = 0;
                    let peakData: number[] = [];
                    const fileOriginal = file.originFileObj;

                    if (fileOriginal.name.length > 80) {
                        return showNotification(
                            'error',
                            messages('track.validation.trackFileName', {
                                number: 80,
                            })
                        );
                    }
                    const fileNameWithoutExtension =
                        fileOriginal.name.lastIndexOf('.') !== -1
                            ? fileOriginal.name.substring(
                                  0,
                                  fileOriginal.name.lastIndexOf('.')
                              )
                            : fileOriginal.name;

                    if (fileOriginal) {
                        const { peakData: data, songDuration: duration } =
                            await getPeakData(file.originFileObj);

                        if (!data) return;

                        peakData = data;
                        songDuration = duration;
                    }

                    const metadata = await extractAudioMetadata(
                        file.originFileObj
                    );

                    const trackInfor: CreateBucketFile = {
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
                        title:
                            fileOriginal.name.lastIndexOf('.') !== -1
                                ? fileOriginal.name.substring(
                                      0,
                                      fileOriginal.name.lastIndexOf('.')
                                  )
                                : fileOriginal.name,
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
                        },
                        key: `track-${index}`,
                        order: index,
                    });

                    temp.push({
                        file: file,
                        key: `track-${index}`,
                    });

                    const peakJson = JSON.stringify(peakData);
                    const peakBlob = new Blob([peakJson], {
                        type: 'application/json',
                    });
                    const peakFile = new File(
                        [peakBlob],
                        fileOriginal.name.replace(/\.\w+$/, '.json'),
                        {
                            type: 'application/json',
                        }
                    );

                    const peakInfor: CreateBucketFile = {
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
                    temp.push({
                        file: peakFile,
                        key: `peak-${index}`,
                    });

                    return [trackInfor, peakInfor];
                }
            );

            const newTracks = (await Promise.all(newTracksPromises))
                .flat()
                .filter((item): item is CreateBucketFile => !!item);

            // create bucket
            const response = await bucketApi.createBuckets({
                bucketDtos: newTracks,
            });

            // Initialize progress state
            const initialProgress: UploadProgress[] = [];
            response.data.forEach((item: any) => {
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

            // Put file into bucket
            const uploadPromises = response.data.map(async (item: any) => {
                const matchedFile = temp.find((i) => {
                    return item.key.includes(i.key);
                });
                if (matchedFile) {
                    try {
                        const fileToUpload =
                            matchedFile.file.originFileObj ?? matchedFile.file;

                        const uploadResponse = await axios.put(
                            item.urlUpload,
                            fileToUpload,
                            {
                                headers: {
                                    'Content-Type':
                                        matchedFile.file.type ||
                                        'application/octet-stream',
                                },
                                onUploadProgress: (progressEvent) => {
                                    const percentCompleted = Math.round(
                                        (progressEvent.loaded * 100) /
                                            (progressEvent.total || 1)
                                    );

                                    setUploadProgress((prev) =>
                                        prev.map((progress) =>
                                            progress.key === item.key
                                                ? {
                                                      ...progress,
                                                      progress:
                                                          percentCompleted,
                                                  }
                                                : progress
                                        )
                                    );
                                },
                            }
                        );

                        if (
                            !uploadResponse.status ||
                            uploadResponse.status >= 400
                        ) {
                            throw new Error(
                                `Failed to upload file. Please try again later.`
                            );
                        }
                    } catch (uploadError) {
                        throw uploadError;
                    }
                }

                if (item.key.startsWith('peak-')) {
                    const index = item.key.split('-')[1]; // Lấy index từ "peak-0"
                    const track = tracksPayload.find(
                        (tp) => tp.key === `track-${index}`
                    );
                    if (track) {
                        track.audioFileDraft.peakId = item.fileId;
                    }
                } else if (item.key.startsWith('track-')) {
                    const track = tracksPayload.find(
                        (tp) => tp.key === item.key
                    );
                    if (track) {
                        track.audioFileDraft.fileId = item.fileId;
                    }
                }
            });

            await Promise.all(uploadPromises);

            const fileIdsSubmit = response.data.map((item: any) => item.fileId);
            // submit file
            await bucketApi.submit({ ids: fileIdsSubmit });

            const variables: CreateVariables<TrackPayload[]> = {
                payload: tracksPayload,
            };

            createTrackDraft(variables);
        } catch (error) {
            setUploadProgress([]);
            showNotification(
                'error',
                messages('file.message.uploadFileFailed')
            );
        }
    };

    // const debouncedHandleUpload = useMemo(
    //     () =>
    //         debounce((files: any[]) => {
    //             handleUpload(files);
    //         }, 300),
    //     [formValues.id, createTrackDraft]
    // );

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
