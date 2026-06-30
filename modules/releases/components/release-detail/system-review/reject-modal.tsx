'use client';

import { Form, Input, Modal } from 'antd';
import { AlertTriangle } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface RejectModalProps {
    open: boolean;
    onCancel: () => void;
    onReject: (reason: string) => void;
}

export default function RejectModal({
    open,
    onCancel,
    onReject,
}: RejectModalProps) {
    const messages = useTranslations();
    const [form] = Form.useForm();

    const handleOk = () => {
        form.submit();
    };

    const handleFinish = (values: { note: string }) => {
        onReject(values.note);
        form.resetFields();
    };

    return (
        <Modal
            title={
                <div className="flex items-center gap-1.5 font-bold text-red-600">
                    <AlertTriangle size={18} />
                    <span>
                        {messages('release.systemReview.rejectModal.title')}
                    </span>
                </div>
            }
            open={open}
            onCancel={() => {
                form.resetFields();
                onCancel();
            }}
            okText={messages('release.systemReview.rejectModal.confirmReject')}
            cancelText={messages('common.cancel')}
            onOk={handleOk}
        >
            <div className="py-2">
                <p className="mb-4 text-sm text-gray-500">
                    {messages('release.systemReview.rejectModal.description')}
                </p>
                <Form form={form} layout="vertical" onFinish={handleFinish}>
                    <Form.Item
                        name="note"
                        label={
                            <span className="font-semibold text-gray-700">
                                {messages(
                                    'release.systemReview.rejectModal.reasonLabel'
                                )}
                            </span>
                        }
                        rules={[
                            {
                                required: true,
                                message: messages(
                                    'release.systemReview.rejectModal.reasonRequired'
                                ),
                            },
                        ]}
                    >
                        <Input.TextArea
                            placeholder={messages(
                                'release.systemReview.rejectModal.reasonPlaceholder'
                            )}
                            rows={4}
                            maxLength={250}
                            showCount
                        />
                    </Form.Item>
                </Form>
            </div>
        </Modal>
    );
}
