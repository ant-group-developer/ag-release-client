'use client';

import { PATH_PARAMS } from '@/enums/routes';
import { cn } from '@/helpers/common';
import { useGetReleaseDetailRoute } from '@/hooks/use-get-release-detail-route';
import { Link } from '@/i18n/routing';
import { RELEASES_TABS } from '@/modules/releases/enums';
import { useBulkUpdateReleaseErrors } from '@/modules/releases/hooks/use-bulk-update-release-errors';
import { useGetDetailRelease } from '@/modules/releases/hooks/use-get-detail-release';
import { useReleaseEnrichedErrors } from '@/modules/releases/hooks/use-release-enriched-errors';
import { ReleaseEnrichedError } from '@/modules/releases/types';
import { SCAN_COPYRIGHT_STATUS } from '@/modules/tracks/enums';
import {
    Alert,
    Button,
    Card,
    Checkbox,
    Form,
    Input,
    Modal,
    notification,
    Popconfirm,
    Table,
    Tag,
    theme,
    Tooltip,
} from 'antd';
import {
    AlertTriangle,
    CheckCircle,
    Clock,
    ExternalLink,
    FileText,
    Loader2,
    Music,
    PackageX,
    Shield,
    ShieldAlert,
    XCircle,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import AcrTrackResultSection from './acr-track-result-section';

// Định nghĩa Enums & Hằng số
enum EXECUTION_STATUS {
    PENDING = 'pending',
    EXECUTED = 'executed',
    REJECTED = 'rejected',
}

interface AuditLog {
    id: string;
    actor: string;
    action: string;
    status: EXECUTION_STATUS;
    timestamp: string;
    note?: string;
}

const MOCK_ADMIN_NAME = 'System Administrator';

export default function SystemReviewTab() {
    const messages = useTranslations();
    const params = useParams();
    const { token } = theme.useToken();

    const releaseId = params[PATH_PARAMS.RELEASE_ID]
        ? `${params[PATH_PARAMS.RELEASE_ID]}`
        : '';

    // Lấy dữ liệu thực tế của Release
    const { releaseData, isLoading: isReleaseLoading } =
        useGetDetailRelease(releaseId);

    // Lấy danh sách lỗi chất lượng (chưa được giải quyết)
    const {
        releaseEnrichedErrorsData = [],
        isFetching: isFetchingEnrichedErrors,
    } = useReleaseEnrichedErrors({ id: releaseId, isFixed: false });

    // Mutation xử lý cập nhật lỗi
    const { bulkUpdateReleaseErrors, isPending: isUpdatingErrors } =
        useBulkUpdateReleaseErrors();

    const { getReleaseTabRoute } = useGetReleaseDetailRoute();

    // Trạng thái cục bộ khi đang update lỗi
    const [updatingErrorId, setUpdatingErrorId] = useState<string | null>(null);
    const [isUpdatingAll, setIsUpdatingAll] = useState(false);

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

    // Cập nhật trạng thái một lỗi thành đã giải quyết
    const handleUpdateError = (id: string) => {
        setUpdatingErrorId(id);
        bulkUpdateReleaseErrors({
            payload: {
                items: [
                    {
                        id,
                        isFixed: true,
                    },
                ],
            },
            onSuccess: () => {
                setUpdatingErrorId(null);
            },
            onError: () => {
                setUpdatingErrorId(null);
            },
        });
    };

    // Cập nhật hàng loạt tất cả lỗi thành đã giải quyết
    const handleUpdateAllErrors = () => {
        setIsUpdatingAll(true);
        const items = releaseEnrichedErrorsData.map((err) => ({
            id: err.id,
            isFixed: true,
        }));
        bulkUpdateReleaseErrors({
            payload: { items },
            onSuccess: () => {
                setIsUpdatingAll(false);
            },
            onError: () => {
                setIsUpdatingAll(false);
            },
        });
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
                                        handleUpdateError(record.id)
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

    const mockTracks = [
        {
            id: 'mock-track-1',
            title: 'Remember Me',
            isrc: 'USUM71890123',
            scanCopyrightStatus: SCAN_COPYRIGHT_STATUS.WARNING,
        },
        {
            id: 'mock-track-2',
            title: 'Sunset Boulevard',
            isrc: 'DEUM71900456',
            scanCopyrightStatus: SCAN_COPYRIGHT_STATUS.WARNING,
        },
        {
            id: 'mock-track-3',
            title: 'Acoustic Garden',
            isrc: 'VNAM12300001',
            scanCopyrightStatus: SCAN_COPYRIGHT_STATUS.FINISHED,
        },
    ] as any[];

    const tracksToShow =
        releaseData?.tracks && releaseData.tracks.length > 0
            ? releaseData.tracks
            : mockTracks;

    // Trạng thái cục bộ của tiến trình duyệt
    const [executionStatus, setExecutionStatus] = useState<EXECUTION_STATUS>(
        EXECUTION_STATUS.PENDING
    );
    const [rejectionReason, setRejectionReason] = useState<string>('');
    const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);

    // Trạng thái modal từ chối
    const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
    const [rejectForm] = Form.useForm();

    // Khởi tạo lịch sử kiểm duyệt ban đầu
    useEffect(() => {
        setExecutionStatus(EXECUTION_STATUS.PENDING);
        setRejectionReason('');
        setAuditLogs([
            {
                id: '1',
                actor: 'System',
                action: 'Khởi tạo tiến trình kiểm duyệt phát hành',
                status: EXECUTION_STATUS.PENDING,
                timestamp: new Date().toLocaleString(),
                note: 'Bản phát hành đã sẵn sàng để kiểm duyệt hệ thống.',
            },
        ]);
    }, []);

    // Xử lý duyệt thực thi
    const handleApprove = () => {
        const newLogs: AuditLog[] = [
            {
                id: Date.now().toString(),
                actor: MOCK_ADMIN_NAME,
                action: 'Duyệt & Cho phép thực thi',
                status: EXECUTION_STATUS.EXECUTED,
                timestamp: new Date().toLocaleString(),
                note: 'Đã duyệt điều kiện phân phối DDEX hoàn tất. Hệ thống bắt đầu đẩy nhạc lên các nền tảng DSPs.',
            },
            ...auditLogs,
        ];
        setExecutionStatus(EXECUTION_STATUS.EXECUTED);
        setAuditLogs(newLogs);

        notification.success({
            message: 'Thành công',
            description: 'Đã phê duyệt và thực thi bản phát hành thành công!',
        });
    };

    // Xử lý từ chối
    const handleRejectSubmit = (values: { reason: string }) => {
        const newLogs: AuditLog[] = [
            {
                id: Date.now().toString(),
                actor: MOCK_ADMIN_NAME,
                action: 'Từ chối thực thi phát hành',
                status: EXECUTION_STATUS.REJECTED,
                timestamp: new Date().toLocaleString(),
                note: `Lý do từ chối: ${values.reason}`,
            },
            ...auditLogs,
        ];
        setExecutionStatus(EXECUTION_STATUS.REJECTED);
        setRejectionReason(values.reason);
        setAuditLogs(newLogs);
        setIsRejectModalOpen(false);
        rejectForm.resetFields();

        notification.warning({
            message: 'Đã từ chối',
            description: 'Đã cập nhật trạng thái từ chối thực thi phát hành.',
        });
    };

    // Phục hồi lại trạng thái chờ duyệt (để test dễ dàng)
    const handleReset = () => {
        const newLogs: AuditLog[] = [
            {
                id: Date.now().toString(),
                actor: MOCK_ADMIN_NAME,
                action: 'Đặt lại trạng thái kiểm duyệt',
                status: EXECUTION_STATUS.PENDING,
                timestamp: new Date().toLocaleString(),
                note: 'Khôi phục trạng thái bản phát hành về Chờ xử lý.',
            },
            ...auditLogs,
        ];
        setExecutionStatus(EXECUTION_STATUS.PENDING);
        setRejectionReason('');
        setAuditLogs(newLogs);

        notification.info({
            message: 'Đã khôi phục',
            description: 'Đã đặt lại trạng thái kiểm duyệt thành công.',
        });
    };

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
        <div className="flex flex-col gap-6 pb-12">
            {/* ALERT CẢNH BÁO LỖI CHẤT LƯỢNG */}
            {releaseEnrichedErrorsData.length > 0 &&
                executionStatus === EXECUTION_STATUS.PENDING && (
                    <Alert
                        message={
                            <div className="flex items-center gap-2 font-bold text-amber-800 dark:text-amber-200">
                                <ShieldAlert size={18} />
                                <span>Cảnh báo lỗi chất lượng phát hành</span>
                            </div>
                        }
                        description={
                            <span className="text-sm text-amber-700 dark:text-amber-300">
                                Bản phát hành này hiện đang có{' '}
                                <strong>
                                    {releaseEnrichedErrorsData.length}
                                </strong>{' '}
                                lỗi chất lượng chưa giải quyết. Vui lòng kiểm
                                tra và khắc phục toàn bộ lỗi chất lượng dưới đây
                                trước khi tiến hành duyệt thực thi.
                            </span>
                        }
                        type="warning"
                        showIcon={false}
                        className="rounded-xl border border-amber-200 bg-amber-50 dark:border-amber-900/50 dark:bg-amber-950/20"
                    />
                )}

            {/* CARD 1: KHUNG DUYỆT THỰC THI */}
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
                            * Lưu ý: Khi duyệt thực thi, bản phát hành sẽ được
                            xác nhận đủ điều kiện và gửi sang tiến trình nén/đẩy
                            metadata DDEX sang các DSPs đã chọn.
                        </p>
                    </div>

                    <div className="flex flex-wrap justify-end gap-2 md:col-span-4">
                        {executionStatus === EXECUTION_STATUS.PENDING ? (
                            <>
                                <Popconfirm
                                    title={
                                        releaseEnrichedErrorsData.length > 0
                                            ? 'Cảnh báo: Bản phát hành vẫn còn lỗi chưa sửa!'
                                            : 'Xác nhận duyệt thực thi?'
                                    }
                                    description={
                                        releaseEnrichedErrorsData.length > 0
                                            ? 'Hệ thống phát hiện lỗi chất lượng chưa giải quyết. Bạn có chắc chắn vẫn muốn duyệt phát hành này?'
                                            : 'Hành động này sẽ duyệt phát hành và bắt đầu tiến trình đẩy nhạc.'
                                    }
                                    onConfirm={handleApprove}
                                    okText={
                                        releaseEnrichedErrorsData.length > 0
                                            ? 'Vẫn duyệt'
                                            : 'Đồng ý'
                                    }
                                    cancelText="Hủy"
                                    okButtonProps={
                                        releaseEnrichedErrorsData.length > 0
                                            ? { danger: true }
                                            : undefined
                                    }
                                >
                                    <Button
                                        type="primary"
                                        danger={
                                            releaseEnrichedErrorsData.length > 0
                                        }
                                        className={cn(
                                            'flex items-center gap-1 border-none font-semibold',
                                            releaseEnrichedErrorsData.length > 0
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
                                    onClick={() => setIsRejectModalOpen(true)}
                                    className="flex items-center gap-1 font-semibold"
                                >
                                    <XCircle size={16} />
                                    Từ chối duyệt
                                </Button>
                            </>
                        ) : (
                            <Button
                                onClick={handleReset}
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

            {/* CARD 1.5: KIỂM TRA LỖI CHẤT LƯỢNG (ENRICHED ERRORS) */}
            <Card
                className="rounded-xl border border-gray-100 shadow-sm"
                style={{ backgroundColor: token.colorBgContainer }}
                title={
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-lg font-bold text-gray-800">
                            <PackageX className="text-red-500" size={20} />
                            <span>
                                Lỗi phát hành (
                                {releaseEnrichedErrorsData.length})
                            </span>
                        </div>
                    </div>
                }
                extra={
                    releaseEnrichedErrorsData.length > 0 && (
                        <Popconfirm
                            title={messages('common.resolveAllErrorsConfirm')}
                            onConfirm={handleUpdateAllErrors}
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
                            Dưới đây là các lỗi được hệ thống tự động phát hiện
                            trong các phần nhập liệu hoặc kiểm duyệt nội dung.
                            Bạn có thể bấm &quot;Sửa&quot; để đi tới tab sửa lỗi
                            hoặc tích chọn để đánh dấu đã xử lý xong.
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

            {/* CARD 2: KẾT QUẢ QUÉT NHẠC TỪ ARC (ACRCLOUD) */}
            <Card
                className="rounded-xl border border-gray-100 shadow-sm"
                style={{ backgroundColor: token.colorBgContainer }}
                title={
                    <div className="flex items-center gap-2 text-lg font-bold text-gray-800">
                        <Music className="text-indigo-500" size={20} />
                        <span>KẾT QUẢ QUÉT BẢN QUYỀN ARC (ACRCLOUD DATA)</span>
                    </div>
                }
            >
                {isReleaseLoading ? (
                    <p className="py-6 text-center text-gray-400">
                        Đang tải danh sách bài hát...
                    </p>
                ) : (
                    <div className="flex flex-col gap-4">
                        <p className="text-sm text-gray-500">
                            Hệ thống tự động thực hiện đối soát âm thanh của
                            từng track trong Release với kho dữ liệu bản quyền
                            thế giới ACRCloud.
                        </p>

                        {tracksToShow.map((track, index) => (
                            <AcrTrackResultSection
                                key={track.id}
                                track={track}
                                index={index}
                            />
                        ))}
                    </div>
                )}
            </Card>

            {/* MODAL TỪ CHỐI DUYỆT */}
            <Modal
                title={
                    <div className="flex items-center gap-1.5 font-bold text-red-600">
                        <AlertTriangle size={18} />
                        <span>TỪ CHỐI THỰC THI PHÁT HÀNH</span>
                    </div>
                }
                open={isRejectModalOpen}
                onCancel={() => setIsRejectModalOpen(false)}
                okText="Xác nhận từ chối"
                okButtonProps={{ danger: true }}
                cancelText="Hủy"
                onOk={() => rejectForm.submit()}
                destroyOnClose
            >
                <div className="py-2">
                    <p className="mb-4 text-sm text-gray-500">
                        Vui lòng nhập lý do từ chối phê duyệt. Lý do này sẽ được
                        ghi nhận vào lịch sử hệ thống và gửi thông báo tới chủ
                        sở hữu bản phát hành.
                    </p>
                    <Form
                        form={rejectForm}
                        layout="vertical"
                        onFinish={handleRejectSubmit}
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
                                    message:
                                        'Vui lòng nhập lý do từ chối duyệt!',
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
        </div>
    );
}

interface AuditLogTableProps {
    auditLogs: AuditLog[];
}

function AuditLogTable({ auditLogs }: AuditLogTableProps) {
    const auditColumns = [
        {
            title: 'Thời gian',
            dataIndex: 'timestamp',
            key: 'timestamp',
            width: '20%',
        },
        {
            title: 'Người thực hiện',
            dataIndex: 'actor',
            key: 'actor',
            width: '20%',
            render: (text: string) => (
                <span className="font-semibold text-gray-700">{text}</span>
            ),
        },
        {
            title: 'Hành động',
            dataIndex: 'action',
            key: 'action',
            width: '25%',
        },
        {
            title: 'Chi tiết / Ghi chú',
            dataIndex: 'note',
            key: 'note',
            render: (text: string) => (
                <span className="italic text-gray-500">{text || 'N/A'}</span>
            ),
        },
    ];

    return (
        <div className="mt-6 border-t pt-6">
            <div className="mb-3 flex items-center gap-1 text-sm font-semibold text-gray-600">
                <FileText size={16} />
                Lịch sử kiểm duyệt hệ thống
            </div>
            <Table
                columns={auditColumns}
                dataSource={auditLogs}
                rowKey="id"
                pagination={false}
                size="small"
                bordered
            />
        </div>
    );
}
