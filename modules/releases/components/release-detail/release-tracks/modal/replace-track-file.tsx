import AppForm from '@/components/ui/antd-form/form';
import AppFormItem from '@/components/ui/antd-form/form-Item';
import WaveAudioUpload from '@/components/ui/input/wave-audio-upload';
import AppModal, { AppModalProps } from '@/components/ui/modal/normal-modal';
import useModalStore from '@/hooks/use-modal';
import { useReleaseFormStore } from '@/modules/releases/hooks/release-form-store';
import { useTrackReplace } from '@/modules/releases/hooks/use-track-replace';
import { TrackData } from '@/modules/tracks/types';
import { Form, Progress, theme, Typography } from 'antd';
import { Disc3 } from 'lucide-react';
import { useTranslations } from 'next-intl';

type Props = {} & Omit<AppModalProps, 'children'>;

function TrackInfoSummary({ track }: { track: TrackData }) {
    const { token } = theme.useToken();
    const messages = useTranslations();
    const currentFileName = track.audioFile?.file?.fileName;

    return (
        <div
            className="mb-4 flex items-center justify-between rounded-lg p-3"
            style={{
                backgroundColor: token.colorFillAlter,
                border: `1px solid ${token.colorBorderSecondary}`,
            }}
        >
            <div className="flex items-center gap-3 overflow-hidden">
                <div
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md"
                    style={{ backgroundColor: token.colorFillSecondary }}
                >
                    <Disc3
                        size={22}
                        style={{ color: token.colorPrimary }}
                    />
                </div>
                <div className="flex min-w-0 flex-col">
                    <Typography.Text
                        strong
                        className="truncate text-sm"
                        title={track.title}
                    >
                        {track.title}
                    </Typography.Text>
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                        {currentFileName && (
                            <Typography.Text
                                type="secondary"
                                className="truncate"
                                title={currentFileName}
                            >
                                {messages('track.currentFile')}:{' '}
                                <span className="font-medium">{currentFileName}</span>
                            </Typography.Text>
                        )}
                        {track.isrc && (
                            <Typography.Text type="secondary">
                                {currentFileName ? '• ' : ''}ISRC: {track.isrc}
                            </Typography.Text>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function ReplaceTrackFileModal({ ...props }: Props) {
    const messages = useTranslations();
    const [form] = Form.useForm();
    const dataEdit = useModalStore((state) => state.dataEdit) as TrackData | null;
    const closeModal = useModalStore((state) => state.closeModal);
    const formValues = useReleaseFormStore((state) => state.formValues);

    const { uploadProgress, handleReplace, pending, resetUpload } = useTrackReplace();

    const handleClose = () => {
        resetUpload();
        form.resetFields();
        closeModal();
    };

    const onFinish = async () => {
        if (!dataEdit?.id) return;

        try {
            const values = await form.validateFields();
            const files = values.audio?.fileList || [];
            const selectedFile = files[0];

            if (!selectedFile) return;

            const releaseId = dataEdit.releaseId || (formValues?.id as string) || '';

            await handleReplace(selectedFile, dataEdit.id, releaseId, {
                onSuccess: () => {
                    handleClose();
                },
            });
        } catch {
            // Form validation or upload error handled in hook
        }
    };

    return (
        <AppModal
            {...props}
            open
            title={messages('track.replaceAudioTitle')}
            onOk={form.submit}
            onCancel={handleClose}
            confirmLoading={pending}
            loading={pending}
            width={650}
            style={{ top: '3rem' }}
            styles={{
                body: { maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' },
            }}
        >
            {dataEdit && <TrackInfoSummary track={dataEdit} />}

            <Typography.Paragraph
                type="secondary"
                className="text-sm"
            >
                {messages('track.replaceAudioDesc')}
            </Typography.Paragraph>

            <AppForm
                form={form}
                layout="vertical"
                onFinish={onFinish}
                showSubmit={false}
                disabled={pending}
            >
                <AppFormItem
                    name="audio"
                    rules={[
                        {
                            validator: (_, value) => {
                                const files = value?.fileList || [];
                                if (files.length === 0) {
                                    return Promise.reject(
                                        new Error(messages('validation.file'))
                                    );
                                }
                                return Promise.resolve();
                            },
                        },
                    ]}
                >
                    <WaveAudioUpload
                        maxCount={1}
                        multiple={false}
                        accept="audio/wav"
                        placeholder={
                            <div className="flex flex-col justify-start gap-2">
                                <Typography.Text>
                                    {messages('placeholder.dragAndDropAudio')}
                                </Typography.Text>
                                <Typography.Text type="secondary" className="text-xs">
                                    {messages('placeholder.supportFormats', {
                                        accept: 'wav',
                                    })}
                                </Typography.Text>
                            </div>
                        }
                        disabled={pending}
                    />

                    {/* Thanh tiến trình khi đang upload */}
                    {uploadProgress && (
                        <div className="mt-4 space-y-2">
                            <div className="mb-1 flex items-center justify-between text-sm">
                                <Typography.Text
                                    className="max-w-[400px] truncate"
                                    title={uploadProgress.fileName}
                                >
                                    {uploadProgress.fileName}
                                </Typography.Text>
                            </div>
                            <Progress
                                percent={uploadProgress.progress}
                                size="small"
                                status={
                                    uploadProgress.progress === 100
                                        ? 'normal'
                                        : 'active'
                                }
                            />
                        </div>
                    )}
                </AppFormItem>
            </AppForm>
        </AppModal>
    );
}
