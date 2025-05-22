import AppForm from '@/components/ui/antd-form/form';
import AppModal, { AppModalProps } from '@/components/ui/modal/normal-modal';
import { useLoading } from '@/hooks/use-loading';
import useModalStore from '@/hooks/use-modal';
import { Form } from 'antd';
import { useTranslations } from 'next-intl';

import AppFormItem from '@/components/ui/antd-form/form-Item';
import DndAudioUpload from '@/components/ui/input/dnd-audio-upload';
import { showNotification } from '@/helpers/messages-helper';
import { useActive } from '@/hooks/use-active';
type Props = {} & Omit<AppModalProps, 'children'>;

export default function AddNewTrackModal({ ...props }: Props) {
    const messages = useTranslations();
    const isLoading = useLoading();
    const [form] = Form.useForm();
    const typeModal = useModalStore((state) => state.typeModal);
    const closeModal = useModalStore((state) => state.closeModal);

    const { isActive, active, deActive } = useActive();

    const onFinish = async () => {
        try {
            const value = await form.validateFields();
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
            maskClosable={false}
            cancelButtonProps={{ disabled: isActive, onClick: closeModal }}
            style={{ top: '1rem' }}
        >
            <AppForm
                form={form}
                layout="vertical"
                onFinish={onFinish}
                showSubmit={false}
                disabled={isActive}
            >
                <AppFormItem>
                    <DndAudioUpload />
                </AppFormItem>
            </AppForm>
        </AppModal>
    );
}
