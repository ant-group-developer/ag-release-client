'use client';

import { Button, Card, Popconfirm, Tag, theme } from 'antd';
import {
    AlertTriangle,
    CheckCircle,
    Clock,
    Shield,
    XCircle,
} from 'lucide-react';
import { cn } from '@/helpers/common';
import { EXECUTION_STATUS, AuditLog } from './types';
import AuditLogTable from './audit-log-table';

interface ApprovalCardProps {
    executionStatus: EXECUTION_STATUS;
    rejectionReason: string;
    releaseEnrichedErrorsCount: number;
    auditLogs: AuditLog[];
    onApprove: () => void;
    onRejectClick: () => void;
    onReset: () => void;
}

export default function ApprovalCard({
    executionStatus,
    rejectionReason,
    releaseEnrichedErrorsCount,
    auditLogs,
    onApprove,
    onRejectClick,
    onReset,
}: ApprovalCardProps) {
    const { token } = theme.useToken();

    // Render tag trạng thái
    const renderStatusTag = (status: EXECUTION_STATUS) => {
        switch (status) {
            case EXECUTION_STATUS.EXECUTED:
                return (
                    <Tag color="success">
                        <span className="inline-flex items-center gap-1 whitespace-nowrap">
                            <CheckCircle size={14} />
                            ĐÃ DUYỆT THỰC THI
                        </span>
                    </Tag>
                );
            case EXECUTION_STATUS.REJECTED:
                return (
                    <Tag color="error">
                        <span className="inline-flex items-center gap-1 whitespace-nowrap">
                            <XCircle size={14} />
                            ĐÃ TỪ CHỐI THỰC THI
                        </span>
                    </Tag>
                );
            default:
                return (
                    <Tag color="processing">
                        <span className="inline-flex items-center gap-1 whitespace-nowrap">
                            <Clock size={14} />
                            ĐANG CHỜ DUYỆT
                        </span>
                    </Tag>
                );
        }
    };

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
                    <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-500">
                            Trạng thái hiện tại:
                        </span>
                        {renderStatusTag(executionStatus)}
                    </div>

                    {rejectionReason && (
                        <div className="mt-2 flex items-start gap-2 rounded-lg border border-red-100 bg-red-50 p-3 text-red-700">
                            <AlertTriangle
                                size={18}
                                className="mt-0.5 shrink-0"
                            />
                            <div>
                                <span className="font-bold">
                                    Lý do từ chối:{' '}
                                </span>
                                <span>{rejectionReason}</span>
                            </div>
                        </div>
                    )}
                    <p className="mt-1 text-xs text-gray-400">
                        * Lưu ý: Khi duyệt thực thi, bản phát hành sẽ được xác
                        nhận đủ điều kiện và gửi sang tiến trình nén/đẩy metadata
                        DDEX sang các DSPs đã chọn.
                    </p>
                </div>

                <div className="flex flex-wrap justify-end gap-2 md:col-span-4">
                    {executionStatus === EXECUTION_STATUS.PENDING ? (
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
                    ) : (
                        <Button
                            onClick={onReset}
                            type="dashed"
                            className="flex items-center gap-1"
                        >
                            <Clock size={14} />
                            Đặt lại trạng thái chờ duyệt
                        </Button>
                    )}
                </div>
            </div>

            {/* BẢNG LỊCH SỬ DUYỆT */}
            <AuditLogTable auditLogs={auditLogs} />
        </Card>
    );
}
