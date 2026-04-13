import AppForm from '@/components/ui/antd-form/form';
import AppModal, { AppModalProps } from '@/components/ui/modal/normal-modal';
import { useLoading } from '@/hooks/use-loading';
import useModalStore from '@/hooks/use-modal';
import { Form, Progress } from 'antd';
import { useTranslations } from 'next-intl';

import AppFormItem from '@/components/ui/antd-form/form-Item';
import WaveAudioUpload from '@/components/ui/input/wave-audio-upload';
import { useActive } from '@/hooks/use-active';
import { useTrackUpload } from '@/modules/releases/hooks/use-track-upload';

type Props = {} & Omit<AppModalProps, 'children'>;

export default function AddNewTrackModal({ ...props }: Props) {
    const messages = useTranslations();
    const isLoading = useLoading();
    const [form] = Form.useForm();
    const typeModal = useModalStore((state) => state.typeModal);
    const closeModal = useModalStore((state) => state.closeModal);

    const { isActive, active, deActive } = useActive();
    const { uploadProgress, handleUpload, pending } = useTrackUpload();

    const onFinish = async () => {
        try {
            active();

            const values = await form.validateFields();
            const files = values.tracks?.fileList || [];

            await handleUpload(files, {
                onSuccess: () => {
                    deActive();
                    closeModal();
                },
                onError: () => {
                    deActive();
                },
            });
        } catch {
            form.resetFields();
            deActive();
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
            style={{ top: '2rem' }}
            styles={{
                body: { maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' },
            }}
        >
            <AppForm
                form={form}
                layout="vertical"
                onFinish={onFinish}
                showSubmit={false}
                disabled={isActive || pending}
            >
                <AppFormItem
                    name="tracks"
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
                        maxCount={50}
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
                        disabled={pending}
                    />

                    {/* Progress bars */}
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
                                    </div>
                                    <Progress
                                        percent={progress.progress}
                                        size="small"
                                        strokeColor={
                                            progress.progress === 100
                                                ? '#BFBFBF'
                                                : undefined
                                        }
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
