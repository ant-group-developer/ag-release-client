import AppForm from '@/components/ui/antd-form/form';
import AppModal, { AppModalProps } from '@/components/ui/modal/normal-modal';
import { useLoading } from '@/hooks/use-loading';
import useModalStore from '@/hooks/use-modal';
import { Form } from 'antd';
import { useTranslations } from 'next-intl';

import AppFormItem from '@/components/ui/antd-form/form-Item';
import WaveAudioUpload from '@/components/ui/input/wave-audio-upload';
import { TYPE_UPLOAD_BUCKET } from '@/enums/common';
import { getPeakData } from '@/helpers/common';
import { showNotification } from '@/helpers/messages-helper';
import { useActive } from '@/hooks/use-active';
import { useReleaseFormStore } from '@/modules/releases/hooks/release-form-store';
import { TrackData } from '@/modules/tracks/types';
import { bucketApi } from '@/modules/upload/apis/bucket-api';
import { CreateBucketFile } from '@/modules/upload/types/data';
type Props = {
    onAddTracks: (tracks: TrackData[]) => void;
} & Omit<AppModalProps, 'children'>;

export default function AddNewTrackModal({ onAddTracks, ...props }: Props) {
    const messages = useTranslations();
    const isLoading = useLoading();
    const [form] = Form.useForm();
    const typeModal = useModalStore((state) => state.typeModal);
    const closeModal = useModalStore((state) => state.closeModal);
    const formValues = useReleaseFormStore((state) => state.formValues);

    const { isActive, active, deActive } = useActive();

    const onFinish = async () => {
        try {
            const values = await form.validateFields();
            const files = values.tracks?.fileList || [];

            const a: { file: File; key: string }[] = [];

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

                    // const metadata = await extractAudioMetadata(
                    //     file.originFileObj
                    // );

                    const trackInfor: CreateBucketFile = {
                        uploadPurpose: TYPE_UPLOAD_BUCKET.TRACK,
                        file: {
                            fileName: fileOriginal.name,
                            contentType: fileOriginal.type,
                            extension: fileOriginal.name.split('.').pop(),
                            fileSize: file.size,
                        },
                        key: `${fileOriginal.name}-${index}`,
                    };
                    a.push({
                        file: file,
                        key: `${fileOriginal.name}-${index}`,
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
                        uploadPurpose: TYPE_UPLOAD_BUCKET.JSON,
                        file: {
                            fileName: peakFile.name,
                            contentType: peakFile.type,
                            extension: 'json',
                            fileSize: peakFile.size,
                        },
                        key: `${peakFile.name}-${index}`,
                    };
                    a.push({
                        file: peakFile,
                        key: `${peakFile.name}-${index}`,
                    });

                    return [trackInfor, peakInfor];
                }
            );

            const newTracks = (await Promise.all(newTracksPromises)).flat();

            const response = await bucketApi.createBuckets({
                createBucketDtos: newTracks,
            });

            const uploadPromises = response.data.map(async (item: any) => {
                const matchedFile = a.find((aItem) => aItem.key === item.key);
                if (matchedFile) {
                    try {
                        const uploadResponse = await fetch(item.urlUpload, {
                            method: 'PUT',
                            headers: {
                                'Content-Type':
                                    matchedFile.file.type ||
                                    'application/octet-stream',
                            },
                            body: matchedFile.file,
                        });

                        if (!uploadResponse.ok) {
                            throw new Error(
                                `Failed to upload file ${matchedFile.key}. Please try again later.`
                            );
                        }

                        console.log(
                            `✅ Successfully uploaded: ${matchedFile.key}`
                        );
                    } catch (uploadError) {
                        console.error(
                            `❌ Failed to upload ${matchedFile.key}:`,
                            uploadError
                        );
                        throw uploadError;
                    }
                }
            });

            await Promise.all(uploadPromises);

            console.log('🚀 ~ onFinish ~ response:', response);
            onAddTracks?.(newTracks);
            closeModal();
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
