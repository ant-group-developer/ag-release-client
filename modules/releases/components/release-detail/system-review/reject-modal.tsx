'use client';

import { Form, Input, Modal } from 'antd';
import { AlertTriangle } from 'lucide-react';

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
    const [form] = Form.useForm();

    const handleOk = () => {
        form.submit();
    };

    const handleFinish = (values: { reason: string }) => {
        onReject(values.reason);
        form.resetFields();
    };

    return (
        <Modal
            title={
                <div className="flex items-center gap-1.5 font-bold text-red-600">
                    <AlertTriangle size={18} />
                    <span>TỪ CHỐI THỰC THI PHÁT HÀNH</span>
                </div>
            }
            open={open}
            onCancel={() => {
                form.resetFields();
                onCancel();
            }}
            okText="Xác nhận từ chối"
            okButtonProps={{ danger: true }}
            cancelText="Hủy"
            onOk={handleOk}
            destroyOnClose
        >
            <div className="py-2">
                <p className="mb-4 text-sm text-gray-500">
                    Vui lòng nhập lý do từ chối phê duyệt. Lý do này sẽ được
                    ghi nhận vào lịch sử hệ thống và gửi thông báo tới chủ sở
                    hữu bản phát hành.
                </p>
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleFinish}
                >
                    <Form.Item
                        name="reason"
                        label={
                            <span className="font-semibold text-gray-700">
                                Lý do từ chối
                            </span>
                        }
                        rules={[
                            {
                                required: true,
                                message: 'Vui lòng nhập lý do từ chối duyệt!',
                            },
                        ]}
                    >
                        <Input.TextArea
                            placeholder="Ví dụ: Bài hát số 1 trùng bản quyền nghiêm trọng với tác phẩm đã được phân phối trên Youtube ContentID..."
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
