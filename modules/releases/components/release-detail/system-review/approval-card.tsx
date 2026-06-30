'use client';

import { cn } from '@/helpers/common';
import { Button, Card, Popconfirm, theme } from 'antd';
import { CheckCircle, Shield, XCircle } from 'lucide-react';

interface ApprovalCardProps {
    releaseEnrichedErrorsCount: number;
    onApprove: () => void;
    onRejectClick: () => void;
}

export default function ApprovalCard({
    releaseEnrichedErrorsCount,
    onApprove,
    onRejectClick,
}: ApprovalCardProps) {
    const { token } = theme.useToken();

    return (
        <Card
            className="rounded-xl border border-gray-100 shadow-sm"
            style={{ backgroundColor: token.colorBgContainer }}
            title={
                <div className="flex items-center gap-2 text-lg font-bold text-gray-800">
                    <Shield className="text-blue-500" size={20} />
                    <span>Duyệt phát hành</span>
                </div>
            }
        >
            <div className="grid grid-cols-1 items-center gap-6 md:grid-cols-12">
                <div className="flex flex-col gap-2 md:col-span-8">
                    <p className="mt-1 text-xs text-gray-400">
                        * Lưu ý: Khi duyệt thực thi, bản phát hành sẽ được xác
                        nhận đủ điều kiện và gửi sang tiến trình nén/đẩy
                        metadata DDEX sang các DSPs đã chọn.
                    </p>
                </div>

                <div className="flex flex-wrap justify-end gap-2 md:col-span-4">
                    <>
                        <Popconfirm
                            title={
                                releaseEnrichedErrorsCount > 0
                                    ? 'Cảnh báo: Bản phát hành vẫn còn lỗi chưa sửa!'
                                    : 'Xác nhận duyệt thực thi?'
                            }
                            description={
                                releaseEnrichedErrorsCount > 0
                                    ? 'Hệ thống phát hiện lỗi chất lượng chưa giải quyết. Bạn có chắc chắn vẫn muốn duyệt phát hành này?'
                                    : 'Hành động này sẽ duyệt phát hành và bắt đầu tiến trình đẩy nhạc.'
                            }
                            onConfirm={onApprove}
                            okText={
                                releaseEnrichedErrorsCount > 0
                                    ? 'Vẫn duyệt'
                                    : 'Đồng ý'
                            }
                            cancelText="Hủy"
                            okButtonProps={
                                releaseEnrichedErrorsCount > 0
                                    ? { danger: true }
                                    : undefined
                            }
                        >
                            <Button
                                type="primary"
                                danger={releaseEnrichedErrorsCount > 0}
                                className={cn(
                                    'flex items-center gap-1 border-none font-semibold',
                                    releaseEnrichedErrorsCount > 0
                                        ? 'bg-red-600 hover:bg-red-500'
                                        : 'bg-emerald-600 hover:bg-emerald-500'
                                )}
                            >
                                <CheckCircle size={16} />
                                Duyệt thực thi
                            </Button>
                        </Popconfirm>

                        <Button
                            danger
                            onClick={onRejectClick}
                            className="flex items-center gap-1 font-semibold"
                        >
                            <XCircle size={16} />
                            Từ chối duyệt
                        </Button>
                    </>
                </div>
            </div>
        </Card>
    );
}
