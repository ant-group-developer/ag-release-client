'use client';

import AppModal from '@/components/ui/modal/normal-modal';
import useModalStore from '@/hooks/use-modal';
import { RELEASE_REVIEW_STATUS } from '@/modules/releases/enums';
import { useBulkReleaseReview } from '@/modules/releases/hooks/use-bulk-release-review';
import { AuditOutlined } from '@ant-design/icons';
import { Form, Input, Select, Space, Typography } from 'antd';
import { useTranslations } from 'next-intl';

interface BulkReviewModalProps {
    onFinished?: () => void;
}

export default function BulkReviewModal({ onFinished }: BulkReviewModalProps) {
    const messages = useTranslations();
    const [form] = Form.useForm();
    const closeModal = useModalStore((state) => state.closeModal);
    const dataEdit = useModalStore<string[]>((state) => state.dataEdit);

    const { bulkReleaseReview, isPending } = useBulkReleaseReview();

    const releaseIds = (dataEdit as string[]) || [];

    const statusOptions = [
        {
            label: messages('status.approved'),
            value: RELEASE_REVIEW_STATUS.COMPLETED,
        },
        {
            label: messages('status.reject'),
            value: RELEASE_REVIEW_STATUS.FAILED,
        },
    ];

    const handleFinish = (values: {
        status: RELEASE_REVIEW_STATUS;
        note?: string;
    }) => {
        if (!releaseIds.length) return;

        bulkReleaseReview({
            payload: {
                releaseIds: releaseIds.map(String),
                status: values.status,
                note: values.note,
            },
            onSuccess: () => {
                closeModal();
                onFinished?.();
            },
        });
    };

    return (
        <AppModal
            title={
                <Space align="center">
                    <AuditOutlined />
                    <span>{messages('release.bulkReviewModal.title')}</span>
                </Space>
            }
            open
            onCancel={closeModal}
            onOk={() => form.submit()}
            confirmLoading={isPending}
            okText={messages('release.bulkReviewModal.submit')}
            cancelText={messages('common.cancel')}
            destroyOnClose
        >
            <div className="py-2">
                <div className="mb-4">
                    <Typography.Text type="secondary">
                        {messages('release.bulkReviewModal.selectedCount', {
                            count: releaseIds.length,
                        })}
                    </Typography.Text>
                </div>

                <Form
                    form={form}
                    layout="vertical"
                    initialValues={{
                        status: RELEASE_REVIEW_STATUS.COMPLETED,
                    }}
                    onFinish={handleFinish}
                >
                    <Form.Item
                        name="status"
                        label={messages('release.bulkReviewModal.status')}
                        rules={[
                            {
                                required: true,
                                message: messages(
                                    'release.bulkReviewModal.statusRequired'
                                ),
                            },
                        ]}
                    >
                        <Select
                            placeholder={messages(
                                'release.bulkReviewModal.statusPlaceholder'
                            )}
                            options={statusOptions}
                        />
                    </Form.Item>

                    <Form.Item
                        name="note"
                        label={messages('release.bulkReviewModal.note')}
                    >
                        <Input.TextArea
                            rows={4}
                            maxLength={250}
                            showCount
                            placeholder={messages(
                                'release.bulkReviewModal.notePlaceholder'
                            )}
                        />
                    </Form.Item>
                </Form>
            </div>
        </AppModal>
    );
}
