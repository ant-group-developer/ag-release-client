import { Button, Form, Input, Modal, Select, Space } from 'antd';
import { Trash2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useRejectReview } from '../../hooks/use-reject-review';
import { TicketIssueItem } from '../../types';

interface Props {
    open: boolean;
    distributionId: string;
    onClose: () => void;
}

interface FormValues {
    note?: string;
    items: TicketIssueItem[];
}

/**
 * Modal reviewer tạo flag lỗi — reject distribution kèm items[] cấu trúc.
 * Mỗi item: code + message + severity (+ location/suggestion optional).
 */
export default function AddFlagModal({
    open,
    distributionId,
    onClose,
}: Props) {
    const messages = useTranslations();
    const [form] = Form.useForm<FormValues>();
    const { rejectReview, isPending } = useRejectReview();

    const t = (k: string) =>
        messages(`distributionOrchestration.flags.${k}` as never);

    const handleOk = async () => {
        const values = await form.validateFields();
        await rejectReview({
            id: distributionId,
            payload: { note: values.note, items: values.items ?? [] },
            onSuccess: () => {
                form.resetFields();
                onClose();
            },
        });
    };

    return (
        <Modal
            open={open}
            title={t('addFlag')}
            okText={t('submitFlags')}
            okButtonProps={{ danger: true, loading: isPending }}
            onOk={handleOk}
            onCancel={onClose}
            width={720}
            destroyOnClose
        >
            <Form form={form} layout="vertical" initialValues={{ items: [{}] }}>
                <Form.Item name="note" label={t('note')}>
                    <Input.TextArea rows={2} maxLength={2000} showCount />
                </Form.Item>

                <Form.List name="items">
                    {(fields, { add, remove }) => (
                        <div className="flex flex-col gap-2">
                            {fields.map((field) => (
                                <Space
                                    key={field.key}
                                    align="baseline"
                                    wrap
                                    className="w-full"
                                >
                                    <Form.Item
                                        name={[field.name, 'code']}
                                        rules={[{ required: true }]}
                                        className="!mb-0"
                                    >
                                        <Input placeholder={t('code')} style={{ width: 120 }} />
                                    </Form.Item>
                                    <Form.Item
                                        name={[field.name, 'message']}
                                        rules={[{ required: true }]}
                                        className="!mb-0"
                                    >
                                        <Input
                                            placeholder={t('message')}
                                            style={{ width: 220 }}
                                        />
                                    </Form.Item>
                                    <Form.Item
                                        name={[field.name, 'severity']}
                                        initialValue="error"
                                        className="!mb-0"
                                    >
                                        <Select
                                            style={{ width: 120 }}
                                            options={[
                                                { value: 'error', label: 'error' },
                                                {
                                                    value: 'warning',
                                                    label: 'warning',
                                                },
                                            ]}
                                        />
                                    </Form.Item>
                                    <Form.Item
                                        name={[field.name, 'location']}
                                        className="!mb-0"
                                    >
                                        <Input
                                            placeholder={t('location')}
                                            style={{ width: 130 }}
                                        />
                                    </Form.Item>
                                    <Button
                                        type="text"
                                        danger
                                        icon={<Trash2 size={16} />}
                                        onClick={() => remove(field.name)}
                                    />
                                </Space>
                            ))}
                            <Button type="dashed" onClick={() => add({})} block>
                                {t('addItem')}
                            </Button>
                        </div>
                    )}
                </Form.List>
            </Form>
        </Modal>
    );
}
