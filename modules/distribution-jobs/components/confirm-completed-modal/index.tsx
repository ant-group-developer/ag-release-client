import { Form, Input, Modal } from 'antd';
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';

interface ConfirmCompletedModalProps {
    open: boolean;
    onCancel: () => void;
    onConfirm: (exportIdFromCi: string) => void;
    loading?: boolean;
}

const ConfirmCompletedModal = ({
    open,
    onCancel,
    onConfirm,
    loading,
}: ConfirmCompletedModalProps) => {
    const messages = useTranslations();
    const [form] = Form.useForm();

    useEffect(() => {
        if (!open) {
            form.resetFields();
        }
    }, [open, form]);

    const handleOk = () => {
        form.validateFields().then((values) => {
            onConfirm(values.exportIdFromCi);
        });
    };

    return (
        <Modal
            title={messages('distributionJobs.confirmCompletedModal.title')}
            open={open}
            onCancel={onCancel}
            onOk={handleOk}
            confirmLoading={loading}
            destroyOnHidden
        >
            <Form form={form} layout="vertical">
                <Form.Item
                    label={messages(
                        'distributionJobs.confirmCompletedModal.exportIdFromCiLabel'
                    )}
                    name="exportIdFromCi"
                    rules={[
                        {
                            required: true,
                            message: messages(
                                'distributionJobs.confirmCompletedModal.exportIdFromCiRequired'
                            ),
                        },
                        {
                            max: 20,
                            message: messages('validation.max', { number: 20 }),
                        },
                    ]}
                >
                    <Input
                        placeholder={messages(
                            'distributionJobs.confirmCompletedModal.exportIdFromCiPlaceholder'
                        )}
                    />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default ConfirmCompletedModal;
