'use client';

import { PAGE_SIZE_EXTRA_LARGE } from '@/constants/page-size';
import { PATH_PARAMS } from '@/enums/routes';
import { RELEASE_ERROR_SUBMISSION_STATUS } from '@/modules/releases/enums';
import { useBulkUpdateReleaseErrors } from '@/modules/releases/hooks/use-bulk-update-release-errors';
import { useGetDetailRelease } from '@/modules/releases/hooks/use-get-detail-release';
import { useReleaseEnrichedErrors } from '@/modules/releases/hooks/use-release-enriched-errors';
import { SCAN_COPYRIGHT_STATUS } from '@/modules/tracks/enums';
import { notification } from 'antd';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import AcrCloudCard from './acr-cloud-card';
import ApprovalCard from './approval-card';
import QualityAlert from './quality-alert';
import RejectModal from './reject-modal';
import ReleaseErrorsCard from './release-errors-card';

export default function SystemReviewTab() {
    const params = useParams();
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
    } = useReleaseEnrichedErrors({
        releaseId,
        submissionStatus: RELEASE_ERROR_SUBMISSION_STATUS.OPEN,
        pageSize: PAGE_SIZE_EXTRA_LARGE,
    });

    // Mutation xử lý cập nhật lỗi
    const { bulkUpdateReleaseErrors, isPending: isUpdatingErrors } =
        useBulkUpdateReleaseErrors();

    // Cập nhật trạng thái một lỗi thành đã giải quyết
    const handleUpdateError = (id: string) => {
        bulkUpdateReleaseErrors({
            payload: {
                items: [
                    {
                        id,
                        submissionStatus: RELEASE_ERROR_SUBMISSION_STATUS.FIXED,
                    },
                ],
            },
        });
    };

    // Cập nhật hàng loạt tất cả lỗi thành đã giải quyết
    const handleUpdateAllErrors = () => {
        const items = releaseEnrichedErrorsData.map((err) => ({
            id: err.id,
            submissionStatus: RELEASE_ERROR_SUBMISSION_STATUS.FIXED,
        }));
        bulkUpdateReleaseErrors({
            payload: { items },
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

    // Trạng thái modal từ chối
    const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);

    // Xử lý duyệt thực thi
    const handleApprove = () => {
        notification.success({
            message: 'Thành công',
            description: 'Đã phê duyệt và thực thi bản phát hành thành công!',
        });
    };

    // Xử lý từ chối
    const handleRejectSubmit = () => {
        setIsRejectModalOpen(false);

        notification.warning({
            message: 'Đã từ chối',
            description: 'Đã cập nhật trạng thái từ chối thực thi phát hành.',
        });
    };

    return (
        <div className="flex flex-col gap-6 pb-12">
            {/* ALERT CẢNH BÁO LỖI CHẤT LƯỢNG */}
            <QualityAlert errorsCount={releaseEnrichedErrorsData.length} />

            {/* CARD 1: KHUNG DUYỆT THỰC THI */}
            <ApprovalCard
                releaseEnrichedErrorsCount={releaseEnrichedErrorsData.length}
                onApprove={handleApprove}
                onRejectClick={() => setIsRejectModalOpen(true)}
            />

            {/* CARD 1.5: KIỂM TRA LỖI CHẤT LƯỢNG (ENRICHED ERRORS) */}
            <ReleaseErrorsCard
                releaseId={releaseId}
                releaseEnrichedErrorsData={releaseEnrichedErrorsData}
                isFetchingEnrichedErrors={isFetchingEnrichedErrors}
                isUpdatingErrors={isUpdatingErrors}
                onUpdateError={handleUpdateError}
                onUpdateAllErrors={handleUpdateAllErrors}
            />

            {/* CARD 2: KẾT QUẢ QUÉT NHẠC TỪ ARC (ACRCLOUD) */}
            <AcrCloudCard tracks={tracksToShow} isLoading={isReleaseLoading} />

            {/* MODAL TỪ CHỐI DUYỆT */}
            <RejectModal
                open={isRejectModalOpen}
                onCancel={() => setIsRejectModalOpen(false)}
                onReject={handleRejectSubmit}
            />
        </div>
    );
}
