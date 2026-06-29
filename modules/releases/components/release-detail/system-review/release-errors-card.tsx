'use client';

import { Alert, Button, Card, Checkbox, Popconfirm, Table, Tag, theme, Tooltip } from 'antd';
import { CheckCircle, ExternalLink, Loader2, PackageX } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { RELEASES_TABS } from '@/modules/releases/enums';
import { ReleaseEnrichedError } from '@/modules/releases/types';
import { useGetReleaseDetailRoute } from '@/hooks/use-get-release-detail-route';

interface ReleaseErrorsCardProps {
    releaseId: string;
    releaseEnrichedErrorsData: ReleaseEnrichedError[];
    isFetchingEnrichedErrors: boolean;
    isUpdatingErrors: boolean;
    updatingErrorId: string | null;
    isUpdatingAll: boolean;
    onUpdateError: (id: string) => void;
    onUpdateAllErrors: () => void;
}

export default function ReleaseErrorsCard({
    releaseId,
    releaseEnrichedErrorsData,
    isFetchingEnrichedErrors,
    isUpdatingErrors,
    updatingErrorId,
    isUpdatingAll,
    onUpdateError,
    onUpdateAllErrors,
}: ReleaseErrorsCardProps) {
    const messages = useTranslations();
    const { token } = theme.useToken();
    const { getReleaseTabRoute } = useGetReleaseDetailRoute();

    // Hàm lấy mô tả chi tiết lỗi phát hành
    const getEnrichedErrorMessages = (error: ReleaseEnrichedError) => {
        return error.message || messages(error.messageCode as any);
    };

    // Hàm lấy nhãn hiển thị cho trang/tab lỗi
    const getTabLabel = (page: string) => {
        switch (page) {
            case RELEASES_TABS.CORE_DETAIL:
                return messages('common.coreInfo');
            case RELEASES_TABS.TRACKS:
                return messages('common.tracks');
            case RELEASES_TABS.SCHEDULE:
                return messages('release.scheduling.label');
            case RELEASES_TABS.DISTRIBUTION:
                return messages('distribute.label');
            case RELEASES_TABS.ANALYTICS:
                return messages('analytics.label');
            case RELEASES_TABS.REVIEW:
                return messages('common.overview');
            default:
                return page;
        }
    };

    // Định nghĩa các cột cho bảng lỗi chất lượng
    const errorColumns = [
        {
            title: 'STT',
            key: 'index',
            width: '8%',
            align: 'center' as const,
            render: (_: any, __: any, index: number) => index + 1,
        },
        {
            title: 'Nội dung lỗi',
            key: 'message',
            render: (record: ReleaseEnrichedError) => (
                <span className="font-medium text-red-600 dark:text-red-400">
                    {getEnrichedErrorMessages(record)}
                </span>
            ),
        },
        {
            title: 'Vị trí lỗi',
            key: 'position',
            width: '25%',
            render: (record: ReleaseEnrichedError) => {
                const tabLabel = getTabLabel(record.page);
                return (
                    <div className="flex flex-wrap gap-1.5">
                        <Tag color="blue">{tabLabel}</Tag>
                        {record.field && record.field !== 'unknown' && (
                            <Tag color="purple">{record.field}</Tag>
                        )}
                    </div>
                );
            },
        },
        {
            title: 'Thao tác',
            key: 'action',
            width: '20%',
            align: 'center' as const,
            render: (record: ReleaseEnrichedError) => {
                const isUpdating =
                    isUpdatingErrors && updatingErrorId === record.id;
                const canLink =
                    !!record.page &&
                    !!record.field &&
                    record.page !== 'unknown' &&
                    record.field !== 'unknown';

                return (
                    <div className="flex items-center justify-center gap-4">
                        {canLink && (
                            <Tooltip title="Đi tới sửa lỗi">
                                <Link
                                    href={`${getReleaseTabRoute(releaseId, record.page as RELEASES_TABS)}#${record.field}`}
                                    scroll={false}
                                    className="flex items-center gap-1 text-blue-500 hover:text-blue-600 hover:underline"
                                >
                                    <ExternalLink size={14} />
                                    <span>Sửa</span>
                                </Link>
                            </Tooltip>
                        )}

                        <Tooltip title={messages('common.markAsResolved')}>
                            {isUpdating ? (
                                <Loader2 className="h-4 w-4 animate-spin text-emerald-600 dark:text-emerald-400" />
                            ) : (
                                <Checkbox
                                    checked={false}
                                    disabled={isUpdatingErrors}
                                    onChange={() =>
                                        onUpdateError(record.id)
                                    }
                                    className="transition-transform hover:scale-105"
                                />
                            )}
                        </Tooltip>
                    </div>
                );
            },
        },
    ];

    return (
        <Card
            className="rounded-xl border border-gray-100 shadow-sm"
            style={{ backgroundColor: token.colorBgContainer }}
            title={
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-lg font-bold text-gray-800">
                        <PackageX className="text-red-500" size={20} />
                        <span>
                            Lỗi phát hành ({releaseEnrichedErrorsData.length})
                        </span>
                    </div>
                </div>
            }
            extra={
                releaseEnrichedErrorsData.length > 0 && (
                    <Popconfirm
                        title={messages('common.resolveAllErrorsConfirm')}
                        onConfirm={onUpdateAllErrors}
                        okText={messages('common.confirm')}
                        cancelText={messages('common.cancel')}
                        okButtonProps={{
                            className:
                                'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 border-none',
                        }}
                        disabled={isUpdatingErrors}
                        placement="bottomRight"
                    >
                        <Button
                            type="link"
                            disabled={isUpdatingErrors}
                            className="flex items-center gap-1 p-0 text-xs font-semibold text-blue-500 hover:text-blue-600 disabled:opacity-50"
                        >
                            {isUpdatingAll && (
                                <Loader2 className="h-2.5 w-2.5 animate-spin" />
                            )}
                            {messages('common.markAllAsResolved')}
                        </Button>
                    </Popconfirm>
                )
            }
        >
            {isFetchingEnrichedErrors &&
            releaseEnrichedErrorsData.length === 0 ? (
                <div className="flex justify-center py-6">
                    <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
                </div>
            ) : releaseEnrichedErrorsData.length === 0 ? (
                <Alert
                    message="Đạt kiểm định chất lượng"
                    description="Tuyệt vời! Không phát hiện lỗi chất lượng hoặc cấu trúc metadata nào cho bản phát hành này. Đạt tiêu chuẩn phân phối."
                    type="success"
                    showIcon
                    icon={
                        <CheckCircle
                            size={18}
                            className="text-emerald-500"
                        />
                    }
                    className="rounded-lg border border-emerald-100 bg-emerald-50/50"
                />
            ) : (
                <div className="flex flex-col gap-4">
                    <p className="text-sm text-gray-500">
                        Dưới đây là các lỗi được hệ thống tự động phát hiện trong
                        các phần nhập liệu hoặc kiểm duyệt nội dung. Bạn có thể
                        bấm &quot;Sửa&quot; để đi tới tab sửa lỗi hoặc tích chọn để
                        đánh dấu đã xử lý xong.
                    </p>
                    <Table
                        columns={errorColumns}
                        dataSource={releaseEnrichedErrorsData}
                        rowKey="id"
                        pagination={false}
                        size="small"
                        bordered
                    />
                </div>
            )}
        </Card>
    );
}
