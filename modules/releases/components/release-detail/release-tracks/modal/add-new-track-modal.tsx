import AppForm from '@/components/ui/antd-form/form';
import AppModal, { AppModalProps } from '@/components/ui/modal/normal-modal';
import { useLoading } from '@/hooks/use-loading';
import useModalStore from '@/hooks/use-modal';
import { Form } from 'antd';
import { useTranslations } from 'next-intl';

import AppFormItem from '@/components/ui/antd-form/form-Item';
import WaveAudioUpload from '@/components/ui/input/wave-audio-upload';
import { TYPE_UPLOAD_BUCKET } from '@/enums/common';
import extractAudioMetadata, { getPeakData } from '@/helpers/common';
import { showNotification } from '@/helpers/messages-helper';
import { genFolderBucket } from '@/helpers/string';
import { useActive } from '@/hooks/use-active';
import { useReleaseFormStore } from '@/modules/releases/hooks/release-form-store';
import { useCreateTrackDraft } from '@/modules/tracks/hooks/use-create-track-draft';
import { TrackData } from '@/modules/tracks/types';
import { TrackPayload } from '@/modules/tracks/types/payload';
import { bucketApi } from '@/modules/upload/apis/bucket-api';
import { AudioFileBucket, CreateBucketFile } from '@/modules/upload/types/data';
import { CreateVariables } from '@/types/api';
type Props = {
    onAddTracks: (tracks: TrackData[]) => void;
} & Omit<AppModalProps, 'children'>;

interface TracksPayload {
    title: string;
    releaseId: string;
    audioFileDraft: AudioFileBucket;
    key: string;
}
export default function AddNewTrackModal({ onAddTracks, ...props }: Props) {
    const messages = useTranslations();
    const isLoading = useLoading();
    const [form] = Form.useForm();
    const typeModal = useModalStore((state) => state.typeModal);
    const closeModal = useModalStore((state) => state.closeModal);
    const formValues = useReleaseFormStore((state) => state.formValues);

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
                        folderBucket: genFolderBucket({
                            releaseId: formValues.id ?? '',
                            uploadPurpose: TYPE_UPLOAD_BUCKET.TRACK,
                            fileName: fileOriginal.name,
                        }),
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
                        folderBucket: genFolderBucket({
                            releaseId: formValues.id ?? '',
                            uploadPurpose: TYPE_UPLOAD_BUCKET.TRACK,
                            fileName: fileOriginal.name,
                        }),
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

            // Put file into bucket
            const uploadPromises = response.data.map(async (item: any) => {
                const matchedFile = temp.find((i) => {
                    return item.key.includes(i.key);
                });
                if (matchedFile) {
                    console.log(matchedFile);

                    try {
                        const uploadResponse = await fetch(item.urlUpload, {
                            method: 'PUT',
                            headers: {
                                'Content-Type':
                                    matchedFile.file.type ||
                                    'application/octet-stream',
                            },
                            body:
                                matchedFile.file.originFileObj ??
                                matchedFile.file,
                        });

                        if (!uploadResponse.ok) {
                            throw new Error(
                                `Failed to upload file ${matchedFile.key}. Please try again later.`
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
            showNotification(
                'error',
                messages('file.message.uploadFileFailed')
            );
        }
    };
    return (
        <AppModal
            {...props}
            title={'Thêm bài hát'}
            onOk={form.submit}
            onCancel={closeModal}
            confirmLoading={isActive}
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
                </AppFormItem>
            </AppForm>
        </AppModal>
    );
}
