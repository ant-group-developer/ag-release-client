'use client';

import { useBulkCreateReleaseErrors } from '@/modules/releases/hooks/use-bulk-create-release-errors';
import { RELEASE_ERROR_TYPE } from '@/modules/releases/enums';
import { Button, Form, Input, Modal, Table } from 'antd';
import { Plus, Trash2 } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface CreateReleaseErrorsFormValues {
    items: {
        message: string;
    }[];
}

interface CreateErrorsModalProps {
    open: boolean;
    releaseId: string;
    onCancel: () => void;
}

export default function CreateErrorsModal({
    open,
    releaseId,
    onCancel,
}: CreateErrorsModalProps) {
    const messages = useTranslations();
    const [form] = Form.useForm<CreateReleaseErrorsFormValues>();
    const { bulkCreateReleaseErrors, isPending: isCreatingErrors } =
        useBulkCreateReleaseErrors();

    const handleClose = () => {
        onCancel();
        form.resetFields();
    };

    const handleSubmit = (values: CreateReleaseErrorsFormValues) => {
        const items = (values.items ?? [])
            .map((item) => item.message?.trim())
            .filter(Boolean)
            .map((message) => ({
                releaseId,
                message,
                type: RELEASE_ERROR_TYPE.ADMIN_CREATE,
            }));

        if (!items.length) return;

        bulkCreateReleaseErrors({
            payload: { items },
            onSuccess: handleClose,
        });
    };

    return (
        <Modal
            title={messages('release.systemReview.createErrorsModal.title')}
            open={open}
            onCancel={handleClose}
            okText={messages('release.systemReview.createErrorsModal.submit')}
            cancelText={messages('common.cancel')}
            confirmLoading={isCreatingErrors}
            onOk={() => form.submit()}
            width={'40vw'}
        >
            <Form<CreateReleaseErrorsFormValues>
                form={form}
                layout="vertical"
                initialValues={{ items: [{ message: '' }] }}
                onFinish={handleSubmit}
            >
                <Form.List name="items">
                    {(fields, { add, remove }) => (
                        <div className="flex flex-col gap-3">
                            <Table
                                columns={[
                                    {
                                        title: messages('common.iNo'),
                                        key: 'index',
                                        width: 64,
                                        align: 'center' as const,
                                        render: (
                                            _: unknown,
                                            __: unknown,
                                            index: number
                                        ) => index + 1,
                                    },
                                    {
                                        title: messages('release.error.description'),
                                        key: 'message',
                                        render: (_, field) => (
                                            <Form.Item
                                                {...field}
                                                name={[field.name, 'message']}
                                                rules={[
                                                    {
                                                        required: true,
                                                        whitespace: true,
                                                        message: messages('release.systemReview.createErrorsModal.required'),
                                                    },
                                                ]}
                                                className="mb-0"
                                            >
                                                <Input.TextArea
                                                    rows={2}
                                                    maxLength={500}
                                                    showCount
                                                    placeholder={messages('release.systemReview.createErrorsModal.placeholder')}
                                                />
                                            </Form.Item>
                                        ),
                                    },
                                    {
                                        title: messages('common.action'),
                                        key: 'action',
                                        width: 96,
                                        align: 'center' as const,
                                        render: (_, field) => (
                                            <Button
                                                danger
                                                type="text"
                                                disabled={fields.length <= 1}
                                                icon={<Trash2 size={16} />}
                                                onClick={() =>
                                                    remove(field.name)
                                                }
                                            />
                                        ),
                                    },
                                ]}
                                dataSource={fields}
                                rowKey="key"
                                pagination={false}
                                size="small"
                                bordered
                            />

                            <Button
                                type="dashed"
                                onClick={() => add({ message: '' })}
                                className="flex items-center justify-center gap-1"
                            >
                                <Plus size={14} />
                                {messages('release.systemReview.createErrorsModal.addErrorRow')}
                            </Button>
                        </div>
                    )}
                </Form.List>
            </Form>
        </Modal>
    );
}
