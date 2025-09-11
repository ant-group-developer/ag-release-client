import AppForm from '@/components/ui/antd-form/form';
import AppModal, { AppModalProps } from '@/components/ui/modal/normal-modal';
import { useLoading } from '@/hooks/use-loading';
import useModalStore from '@/hooks/use-modal';
import { Form, Progress } from 'antd';
import axios from 'axios';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import AppFormItem from '@/components/ui/antd-form/form-Item';
import WaveAudioUpload from '@/components/ui/input/wave-audio-upload';
import { TYPE_UPLOAD_BUCKET } from '@/enums/common';
import extractAudioMetadata, { getPeakData } from '@/helpers/common';
import { showNotification } from '@/helpers/messages-helper';
import { useActive } from '@/hooks/use-active';
import { useReleaseFormStore } from '@/modules/releases/hooks/release-form-store';
import { useCreateTrackDraft } from '@/modules/tracks/hooks/use-create-track-draft';
import { TrackPayload } from '@/modules/tracks/types/payload';
import { bucketApi } from '@/modules/upload/apis/bucket-api';
import { AudioFileBucket, CreateBucketFile } from '@/modules/upload/types/data';
import { CreateVariables } from '@/types/api';

type Props = {} & Omit<AppModalProps, 'children'>;

interface TracksPayload {
    title: string;
    releaseId: string;
    audioFileDraft: AudioFileBucket;
    key: string;
}

interface UploadProgress {
    fileName: string;
    progress: number;
    key: string;
}

export default function AddNewTrackModal({ ...props }: Props) {
    const messages = useTranslations();
    const isLoading = useLoading();
    const [form] = Form.useForm();
    const typeModal = useModalStore((state) => state.typeModal);
    const closeModal = useModalStore((state) => state.closeModal);
    const formValues = useReleaseFormStore((state) => state.formValues);
    const [uploadProgress, setUploadProgress] = useState<UploadProgress[]>([]);

    const { isActive, active, deActive } = useActive();
    const { createTrackDraft } = useCreateTrackDraft();

    const onFinish = async () => {
        try {
            active();
            const values = await form.validateFields();
            const files = values.tracks?.fileList || [];

            const tracksPayload: TracksPayload[] = [];

            // temp for handle store file and key
            const temp: { file: any; key: string }[] = [];

            const newTracksPromises = files.map(
                async (file: any, index: number) => {
                    let songDuration = 0;
                    let peakData: number[] = [];
                    const fileOriginal = file.originFileObj;

                    if (fileOriginal.name.length > 80) {
                        closeModal();
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

            const newTracks = (await Promise.all(newTracksPromises)).flat();

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
                onSuccess: () => {
                    deActive();
                    closeModal();
                },
                onError: () => {
                    deActive();
                },
            };

            createTrackDraft(variables);
        } catch (error) {
            setUploadProgress([]);
            form.resetFields();
            deActive();
            showNotification(
                'error',
                messages('file.message.uploadFileFailed')
            );
        }
    };

    return (
        <AppModal
            {...props}
            open
            title={messages('track.add')}
            onOk={form.submit}
            onCancel={() => {
                closeModal();
                form.resetFields();
            }}
            confirmLoading={isActive}
            loading={isActive}
            width={750}
            style={{ top: '4rem' }}
        >
            <AppForm
                form={form}
                layout="vertical"
                onFinish={onFinish}
                showSubmit={false}
                disabled={isActive}
            >
                <AppFormItem name="tracks">
                    <WaveAudioUpload
                        multiple
                        accept="audio/wav"
                        placeholder={
                            <div className="flex flex-col justify-start gap-2">
                                <p>
                                    {messages('placeholder.dragAndDropAudio')}
                                </p>
                                <p>
                                    {messages('placeholder.supportFormats', {
                                        accept: 'wav',
                                    })}
                                </p>
                            </div>
                        }
                    />

                    {/* Progress bars ngay dưới WaveAudioUpload */}
                    {uploadProgress.length > 0 && (
                        <div className="mt-4 space-y-3">
                            {uploadProgress.map((progress) => (
                                <div key={progress.key}>
                                    <div className="mb-1 flex items-center justify-between text-sm">
                                        <span
                                            className="max-w-[300px] truncate"
                                            title={progress.fileName}
                                        >
                                            {progress.fileName}
                                        </span>
                                        {/* <span>{progress.progress}%</span> */}
                                    </div>
                                    <Progress
                                        percent={progress.progress}
                                        size="small"
                                        strokeColor="#1890ff"
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </AppFormItem>
            </AppForm>
        </AppModal>
    );
}
