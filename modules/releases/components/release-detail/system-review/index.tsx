'use client';

import { DATE_FORMAT, ORDER } from '@/enums/common';
import { PATH_PARAMS } from '@/enums/routes';
import { cn, formattedDate } from '@/helpers/common';
import { useBulkCreateReleaseErrors } from '@/modules/releases/hooks/use-bulk-create-release-errors';
import { useBulkUpdateReleaseErrors } from '@/modules/releases/hooks/use-bulk-update-release-errors';
import { useGetDetailRelease } from '@/modules/releases/hooks/use-get-detail-release';
import { useReleaseEnrichedErrors } from '@/modules/releases/hooks/use-release-enriched-errors';
import { useUpdateReleaseReviewDecision } from '@/modules/releases/hooks/use-update-release-review-decision';
import {
    ErrorApprovalStatus,
    ErrorSubmissionStatus,
    FieldOrderReleaseError,
    ReleaseEnrichedError,
    ReleaseErrorType,
    ReleaseReviewStatus,
} from '@/modules/releases/types';
import { SCAN_COPYRIGHT_STATUS } from '@/modules/tracks/enums';
import {
    Alert,
    Button,
    Card,
    Form,
    Input,
    Modal,
    notification,
    Popconfirm,
    Select,
    Table,
    Tag,
    theme,
} from 'antd';
import {
    CheckCircle,
    Clock,
    FileText,
    Loader2,
    Music,
    PackageX,
    Plus,
    Shield,
    ShieldAlert,
    Trash2,
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

interface CreateReleaseErrorsFormValues {
    items: {
        message: string;
    }[];
}

interface ReleaseErrorFilterState {
    keyword?: string;
    submissionStatus?: ErrorSubmissionStatus;
    approvalStatus?: ErrorApprovalStatus;
    type?: ReleaseErrorType;
    fieldOrder?: FieldOrderReleaseError;
    orderBy?: ORDER;
}

const DEFAULT_RELEASE_ERROR_FILTERS: ReleaseErrorFilterState = {
    fieldOrder: FieldOrderReleaseError.createdAt,
    orderBy: ORDER.DESC,
};

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
    const [releaseErrorFilters, setReleaseErrorFilters] =
        useState<ReleaseErrorFilterState>(DEFAULT_RELEASE_ERROR_FILTERS);

    const {
        releaseEnrichedErrorsData = [],
        isFetching: isFetchingEnrichedErrors,
    } = useReleaseEnrichedErrors({
        id: releaseId,
        ...releaseErrorFilters,
    });

    // Mutation xử lý cập nhật lỗi
    const { bulkUpdateReleaseErrors, isPending: isUpdatingErrors } =
        useBulkUpdateReleaseErrors();
    const { bulkCreateReleaseErrors, isPending: isCreatingErrors } =
        useBulkCreateReleaseErrors();
    const { updateReleaseReviewDecision, isPending: isUpdatingReviewDecision } =
        useUpdateReleaseReviewDecision();

    // Trạng thái cục bộ khi đang update lỗi
    const [updatingErrorId, setUpdatingErrorId] = useState<string | null>(null);
    const [isUpdatingAll, setIsUpdatingAll] = useState(false);
    const [isCreateErrorsModalOpen, setIsCreateErrorsModalOpen] =
        useState(false);
    const [createErrorsForm] = Form.useForm<CreateReleaseErrorsFormValues>();

    const hasReleaseErrorFilters =
        Boolean(releaseErrorFilters.keyword?.trim()) ||
        Boolean(releaseErrorFilters.submissionStatus) ||
        Boolean(releaseErrorFilters.approvalStatus) ||
        Boolean(releaseErrorFilters.type) ||
        releaseErrorFilters.fieldOrder !==
            DEFAULT_RELEASE_ERROR_FILTERS.fieldOrder ||
        releaseErrorFilters.orderBy !== DEFAULT_RELEASE_ERROR_FILTERS.orderBy;

    // Hàm lấy mô tả chi tiết lỗi phát hành
    const getEnrichedErrorMessages = (error: ReleaseEnrichedError) => {
        return error.message || messages(error.messageCode as any);
    };

    // Hàm lấy nhãn hiển thị cho trang/tab lỗi
    // Cập nhật trạng thái một lỗi thành đã giải quyết
    const handleUpdateError = (
        id: string,
        approvalStatus: ErrorApprovalStatus
    ) => {
        setUpdatingErrorId(id);
        bulkUpdateReleaseErrors({
            payload: {
                items: [
                    {
                        id,
                        approvalStatus,
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
            approvalStatus: ErrorApprovalStatus.APPROVED,
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
    const handleCreateErrorsSubmit = (
        values: CreateReleaseErrorsFormValues
    ) => {
        const items = (values.items ?? [])
            .map((item) => item.message?.trim())
            .filter(Boolean)
            .map((message) => ({
                releaseId,
                message,
                type: ReleaseErrorType.ADMIN_CREATE,
            }));

        if (!items.length) return;

        bulkCreateReleaseErrors({
            payload: { items },
            onSuccess: () => {
                setIsCreateErrorsModalOpen(false);
                createErrorsForm.resetFields();
            },
        });
    };

    const renderSubmissionStatus = (status?: ErrorSubmissionStatus) => {
        switch (status) {
            case ErrorSubmissionStatus.FIXED:
                return <Tag color="success">FIXED</Tag>;
            case ErrorSubmissionStatus.OPEN:
                return <Tag color="warning">OPEN</Tag>;
            default:
                return <Tag>{status || 'N/A'}</Tag>;
        }
    };

    const renderApprovalStatus = (status?: ErrorApprovalStatus) => {
        switch (status) {
            case ErrorApprovalStatus.APPROVED:
                return <Tag color="success">APPROVED</Tag>;
            case ErrorApprovalStatus.REJECTED:
                return <Tag color="error">REJECTED</Tag>;
            case ErrorApprovalStatus.PENDING:
                return <Tag color="processing">PENDING</Tag>;
            default:
                return <Tag>{status || 'N/A'}</Tag>;
        }
    };

    const renderErrorType = (type?: ReleaseErrorType | null) => {
        switch (type) {
            case ReleaseErrorType.ADMIN_CREATE:
                return <Tag color="blue">ADMIN_CREATE</Tag>;
            case ReleaseErrorType.IMPORT_CI:
                return <Tag color="purple">IMPORT_CI</Tag>;
            case ReleaseErrorType.QA_FLAG_CI:
                return <Tag color="orange">QA_FLAG_CI</Tag>;
            default:
                return <Tag>N/A</Tag>;
        }
    };

    const errorColumns = [
        {
            title: 'STT',
            key: 'index',
            width: 72,
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
            title: 'Submission Status',
            dataIndex: 'submissionStatus',
            key: 'submissionStatus',
            width: 170,
            render: renderSubmissionStatus,
        },
        {
            title: 'Approval Status',
            dataIndex: 'approvalStatus',
            key: 'approvalStatus',
            width: 160,
            render: renderApprovalStatus,
        },
        {
            title: 'Type',
            dataIndex: 'type',
            key: 'type',
            width: 140,
            render: renderErrorType,
        },
        {
            title: 'Created At',
            dataIndex: 'createdAt',
            key: 'createdAt',
            width: 180,
            render: (createdAt?: string) =>
                formattedDate(createdAt, DATE_FORMAT.DATE_MINUTE) || 'N/A',
        },
        {
            title: 'Updated At',
            dataIndex: 'updatedAt',
            key: 'updatedAt',
            width: 180,
            render: (updatedAt?: string | null) =>
                formattedDate(updatedAt, DATE_FORMAT.DATE_MINUTE) || 'N/A',
        },
        {
            title: 'Thao tác',
            key: 'action',
            width: 180,
            align: 'center' as const,
            render: (record: ReleaseEnrichedError) => {
                const isUpdating =
                    isUpdatingErrors && updatingErrorId === record.id;
                return (
                    <div className="flex items-center justify-center gap-2">
                        {isUpdating ? (
                            <Loader2 className="h-4 w-4 animate-spin text-emerald-600 dark:text-emerald-400" />
                        ) : (
                            <div className="flex items-center gap-2">
                                <Button
                                    size="small"
                                    type="primary"
                                    disabled={isUpdatingErrors}
                                    onClick={() =>
                                        handleUpdateError(
                                            record.id,
                                            ErrorApprovalStatus.APPROVED
                                        )
                                    }
                                >
                                    Approve
                                </Button>
                                <Button
                                    size="small"
                                    danger
                                    disabled={isUpdatingErrors}
                                    onClick={() =>
                                        handleUpdateError(
                                            record.id,
                                            ErrorApprovalStatus.REJECTED
                                        )
                                    }
                                >
                                    Reject
                                </Button>
                            </div>
                        )}
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
    const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);

    // Khởi tạo lịch sử kiểm duyệt ban đầu
    useEffect(() => {
        setExecutionStatus(EXECUTION_STATUS.PENDING);
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

    const handleApprove = () => {
        updateReleaseReviewDecision({
            id: releaseId,
            payload: {
                status: ReleaseReviewStatus.COMPLETED,
            },
            onSuccess: () => {
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
                    description:
                        'Đã phê duyệt và thực thi bản phát hành thành công!',
                });
            },
        });
    };

    const handleReject = () => {
        updateReleaseReviewDecision({
            id: releaseId,
            payload: {
                status: ReleaseReviewStatus.FAILED,
            },
            onSuccess: () => {
                const newLogs: AuditLog[] = [
                    {
                        id: Date.now().toString(),
                        actor: MOCK_ADMIN_NAME,
                        action: 'Từ chối thực thi phát hành',
                        status: EXECUTION_STATUS.REJECTED,
                        timestamp: new Date().toLocaleString(),
                        note: 'Đã từ chối duyệt phát hành. Các lỗi đang chờ duyệt sẽ được cập nhật sang REJECTED.',
                    },
                    ...auditLogs,
                ];
                setExecutionStatus(EXECUTION_STATUS.REJECTED);
                setAuditLogs(newLogs);

                notification.warning({
                    message: 'Đã từ chối',
                    description:
                        'Đã cập nhật trạng thái từ chối thực thi phát hành.',
                });
            },
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
                                    title="Xác nhận duyệt thực thi?"
                                    description="Hành động này sẽ duyệt phát hành và cập nhật các lỗi đang chờ duyệt sang APPROVED."
                                    onConfirm={handleApprove}
                                    okText="Đồng ý"
                                    cancelText="Hủy"
                                    okButtonProps={{
                                        loading: isUpdatingReviewDecision,
                                    }}
                                >
                                    <Button
                                        type="primary"
                                        loading={isUpdatingReviewDecision}
                                        disabled={isUpdatingReviewDecision}
                                        className="flex items-center gap-1 border-none bg-emerald-600 font-semibold hover:bg-emerald-500"
                                    >
                                        <CheckCircle size={16} />
                                        Duyệt thực thi
                                    </Button>
                                </Popconfirm>

                                <Popconfirm
                                    title="Xác nhận từ chối duyệt?"
                                    description="Hành động này sẽ từ chối phát hành và cập nhật các lỗi đang chờ duyệt sang REJECTED."
                                    onConfirm={handleReject}
                                    okText="Đồng ý"
                                    cancelText="Hủy"
                                    okButtonProps={{
                                        danger: true,
                                        loading: isUpdatingReviewDecision,
                                    }}
                                >
                                    <Button
                                        danger
                                        disabled={isUpdatingReviewDecision}
                                        className="flex items-center gap-1 font-semibold"
                                    >
                                        <XCircle size={16} />
                                        Từ chối duyệt
                                    </Button>
                                </Popconfirm>
                                <p className="w-full text-right text-xs text-gray-400">
                                    API updateReleaseReview sẽ cập nhật Approval
                                    Status của các lỗi đang chờ duyệt: COMPLETED
                                    thành APPROVED, FAILED thành REJECTED.
                                </p>
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
                    <div className="flex items-center gap-3">
                        <Button
                            size="small"
                            type="primary"
                            onClick={() => setIsCreateErrorsModalOpen(true)}
                            className="flex items-center gap-1"
                        >
                            <Plus size={14} />
                            Thêm lỗi
                        </Button>

                        {releaseEnrichedErrorsData.length > 0 && (
                            <Popconfirm
                                title="Approve all release errors?"
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
                                    Approve all
                                </Button>
                            </Popconfirm>
                        )}
                    </div>
                }
            >
                <div className="mb-4 grid gap-3 md:grid-cols-2 xl:grid-cols-6">
                    <Input.Search
                        allowClear
                        placeholder="Tìm nội dung lỗi"
                        value={releaseErrorFilters.keyword}
                        onChange={(event) =>
                            setReleaseErrorFilters((prev) => ({
                                ...prev,
                                keyword: event.target.value || undefined,
                            }))
                        }
                    />
                    <Select
                        allowClear
                        placeholder="Submission status"
                        value={releaseErrorFilters.submissionStatus}
                        options={Object.values(ErrorSubmissionStatus).map(
                            (status) => ({
                                label: status,
                                value: status,
                            })
                        )}
                        onChange={(submissionStatus) =>
                            setReleaseErrorFilters((prev) => ({
                                ...prev,
                                submissionStatus,
                            }))
                        }
                    />
                    <Select
                        allowClear
                        placeholder="Approval status"
                        value={releaseErrorFilters.approvalStatus}
                        options={Object.values(ErrorApprovalStatus).map(
                            (status) => ({
                                label: status,
                                value: status,
                            })
                        )}
                        onChange={(approvalStatus) =>
                            setReleaseErrorFilters((prev) => ({
                                ...prev,
                                approvalStatus,
                            }))
                        }
                    />
                    <Select
                        allowClear
                        placeholder="Type"
                        value={releaseErrorFilters.type}
                        options={Object.values(ReleaseErrorType).map(
                            (type) => ({
                                label: type,
                                value: type,
                            })
                        )}
                        onChange={(type) =>
                            setReleaseErrorFilters((prev) => ({
                                ...prev,
                                type,
                            }))
                        }
                    />
                    <Select
                        value={releaseErrorFilters.fieldOrder}
                        options={[
                            {
                                label: 'Ngày tạo',
                                value: FieldOrderReleaseError.createdAt,
                            },
                            {
                                label: 'Ngày cập nhật',
                                value: FieldOrderReleaseError.updatedAt,
                            },
                            {
                                label: 'Nội dung lỗi',
                                value: FieldOrderReleaseError.message,
                            },
                            {
                                label: 'Type',
                                value: FieldOrderReleaseError.type,
                            },
                            {
                                label: 'Submission status',
                                value: FieldOrderReleaseError.submissionStatus,
                            },
                            {
                                label: 'Approval status',
                                value: FieldOrderReleaseError.approvalStatus,
                            },
                        ]}
                        onChange={(fieldOrder) =>
                            setReleaseErrorFilters((prev) => ({
                                ...prev,
                                fieldOrder,
                            }))
                        }
                    />
                    <div className="flex gap-2">
                        <Select
                            className="min-w-24 flex-1"
                            value={releaseErrorFilters.orderBy}
                            options={[
                                { label: 'Mới nhất', value: ORDER.DESC },
                                { label: 'Cũ nhất', value: ORDER.ASC },
                            ]}
                            onChange={(orderBy) =>
                                setReleaseErrorFilters((prev) => ({
                                    ...prev,
                                    orderBy,
                                }))
                            }
                        />
                        <Button
                            disabled={!hasReleaseErrorFilters}
                            onClick={() =>
                                setReleaseErrorFilters(
                                    DEFAULT_RELEASE_ERROR_FILTERS
                                )
                            }
                        >
                            Xóa lọc
                        </Button>
                    </div>
                </div>

                {isFetchingEnrichedErrors &&
                releaseEnrichedErrorsData.length === 0 ? (
                    <div className="flex justify-center py-6">
                        <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
                    </div>
                ) : releaseEnrichedErrorsData.length === 0 ? (
                    <Alert
                        message={
                            hasReleaseErrorFilters
                                ? 'Không tìm thấy lỗi phù hợp'
                                : 'Đạt kiểm định chất lượng'
                        }
                        description={
                            hasReleaseErrorFilters
                                ? 'Không có lỗi phát hành nào khớp với bộ lọc hiện tại.'
                                : 'Tuyệt vời! Không phát hiện lỗi chất lượng hoặc cấu trúc metadata nào cho bản phát hành này. Đạt tiêu chuẩn phân phối.'
                        }
                        type={hasReleaseErrorFilters ? 'info' : 'success'}
                        showIcon
                        icon={
                            <CheckCircle
                                size={18}
                                className={
                                    hasReleaseErrorFilters
                                        ? 'text-blue-500'
                                        : 'text-emerald-500'
                                }
                            />
                        }
                        className={cn(
                            'rounded-lg',
                            hasReleaseErrorFilters
                                ? 'border border-blue-100 bg-blue-50/50'
                                : 'border border-emerald-100 bg-emerald-50/50'
                        )}
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

            <Modal
                title="Thêm lỗi phát hành"
                open={isCreateErrorsModalOpen}
                onCancel={() => {
                    setIsCreateErrorsModalOpen(false);
                    createErrorsForm.resetFields();
                }}
                okText="Tạo lỗi"
                cancelText={messages('common.cancel')}
                confirmLoading={isCreatingErrors}
                onOk={() => createErrorsForm.submit()}
                destroyOnClose
            >
                <Form<CreateReleaseErrorsFormValues>
                    form={createErrorsForm}
                    layout="vertical"
                    initialValues={{ items: [{ message: '' }] }}
                    onFinish={handleCreateErrorsSubmit}
                >
                    <Form.List name="items">
                        {(fields, { add, remove }) => (
                            <div className="flex flex-col gap-3">
                                <Table
                                    columns={[
                                        {
                                            title: 'STT',
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
                                            title: 'Nội dung lỗi',
                                            key: 'message',
                                            render: (_, field) => (
                                                <Form.Item
                                                    {...field}
                                                    name={[
                                                        field.name,
                                                        'message',
                                                    ]}
                                                    rules={[
                                                        {
                                                            required: true,
                                                            whitespace: true,
                                                            message:
                                                                'Vui lòng nhập nội dung lỗi',
                                                        },
                                                    ]}
                                                    className="mb-0"
                                                >
                                                    <Input.TextArea
                                                        rows={2}
                                                        maxLength={500}
                                                        showCount
                                                        placeholder="Nhập nội dung lỗi"
                                                    />
                                                </Form.Item>
                                            ),
                                        },
                                        {
                                            title: 'Thao tác',
                                            key: 'action',
                                            width: 96,
                                            align: 'center' as const,
                                            render: (_, field) => (
                                                <Button
                                                    danger
                                                    type="text"
                                                    disabled={
                                                        fields.length <= 1
                                                    }
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
                                    Thêm dòng lỗi
                                </Button>
                            </div>
                        )}
                    </Form.List>
                </Form>
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
