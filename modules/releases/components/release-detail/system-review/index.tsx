'use client';

import { PATH_PARAMS } from '@/enums/routes';
import { useBulkUpdateReleaseErrors } from '@/modules/releases/hooks/use-bulk-update-release-errors';
import { useGetDetailRelease } from '@/modules/releases/hooks/use-get-detail-release';
import { useReleaseEnrichedErrors } from '@/modules/releases/hooks/use-release-enriched-errors';
import { SCAN_COPYRIGHT_STATUS } from '@/modules/tracks/enums';
import { Alert, Card, notification, theme } from 'antd';
import { Music, ShieldAlert } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import AcrTrackResultSection from './acr-track-result-section';
import { EXECUTION_STATUS, AuditLog } from './types';
import ApprovalCard from './approval-card';
import ReleaseErrorsCard from './release-errors-card';
import RejectModal from './reject-modal';

const MOCK_ADMIN_NAME = 'System Administrator';

export default function SystemReviewTab() {
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

    // Trạng thái cục bộ khi đang update lỗi
    const [updatingErrorId, setUpdatingErrorId] = useState<string | null>(null);
    const [isUpdatingAll, setIsUpdatingAll] = useState(false);

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
    const handleRejectSubmit = (reason: string) => {
        const newLogs: AuditLog[] = [
            {
                id: Date.now().toString(),
                actor: MOCK_ADMIN_NAME,
                action: 'Từ chối thực thi phát hành',
                status: EXECUTION_STATUS.REJECTED,
                timestamp: new Date().toLocaleString(),
                note: `Lý do từ chối: ${reason}`,
            },
            ...auditLogs,
        ];
        setExecutionStatus(EXECUTION_STATUS.REJECTED);
        setRejectionReason(reason);
        setAuditLogs(newLogs);
        setIsRejectModalOpen(false);

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
            <ApprovalCard
                executionStatus={executionStatus}
                rejectionReason={rejectionReason}
                releaseEnrichedErrorsCount={releaseEnrichedErrorsData.length}
                auditLogs={auditLogs}
                onApprove={handleApprove}
                onRejectClick={() => setIsRejectModalOpen(true)}
                onReset={handleReset}
            />

            {/* CARD 1.5: KIỂM TRA LỖI CHẤT LƯỢNG (ENRICHED ERRORS) */}
            <ReleaseErrorsCard
                releaseId={releaseId}
                releaseEnrichedErrorsData={releaseEnrichedErrorsData}
                isFetchingEnrichedErrors={isFetchingEnrichedErrors}
                isUpdatingErrors={isUpdatingErrors}
                updatingErrorId={updatingErrorId}
                isUpdatingAll={isUpdatingAll}
                onUpdateError={handleUpdateError}
                onUpdateAllErrors={handleUpdateAllErrors}
            />

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
            <RejectModal
                open={isRejectModalOpen}
                onCancel={() => setIsRejectModalOpen(false)}
                onReject={handleRejectSubmit}
            />
        </div>
    );
}
