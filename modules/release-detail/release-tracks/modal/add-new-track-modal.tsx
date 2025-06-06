import AppForm from '@/components/ui/antd-form/form';
import AppModal, { AppModalProps } from '@/components/ui/modal/normal-modal';
import { useLoading } from '@/hooks/use-loading';
import useModalStore from '@/hooks/use-modal';
import { Form } from 'antd';
import { useTranslations } from 'next-intl';

import AppFormItem from '@/components/ui/antd-form/form-Item';
import DndAudioUpload from '@/components/ui/input/dnd-audio-upload';
import { getFileName, getPeakData } from '@/helpers/common';
import { showNotification } from '@/helpers/messages-helper';
import { useActive } from '@/hooks/use-active';
import { useReleaseFormStore } from '@/modules/releases/hooks/releaseFormStore';
import { TrackData } from '@/modules/tracks/types';
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
    const mainArtist = formValues?.artists?.find(
        (artist: any) => artist.role === 'Main Artist'
    );

    const { isActive, active, deActive } = useActive();

    const onFinish = async () => {
        try {
            const values = await form.validateFields();
            const files = values.tracks?.fileList || [];

            const newTracksPromises: Promise<TrackData>[] = files.map(
                async (file: any, index: number) => {
                    let songDuration = 0;
                    let peakData: number[] = [];
                    if (file.originFileObj) {
                        const { peakData: data, songDuration: duration } =
                            await getPeakData(file.originFileObj);
                        peakData = data;
                        songDuration = duration;
                    }

                    return {
                        id: Date.now() + index,
                        title: getFileName(file),
                        file: file.originFileObj,
                        artist: mainArtist?.id ?? '',
                        songInfo: {
                            duration: songDuration,
                            peakData: peakData,
                        },
                    };
                }
            );
            const newTracks = await Promise.all(newTracksPromises);
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
                    <DndAudioUpload
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
