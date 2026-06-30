'use client';

import { PATH_PARAMS } from '@/enums/routes';
import useModalStore from '@/hooks/use-modal';
import { TYPE_MODAL_RELEASE } from '@/modules/releases/enums';
import { useGetDetailRelease } from '@/modules/releases/hooks/use-get-detail-release';
import { useReleaseEnrichedErrors } from '@/modules/releases/hooks/use-release-enriched-errors';
import { RELEASE_ERROR_APPROVAL_STATUS } from '@/modules/releases/enums';
import { SCAN_COPYRIGHT_STATUS } from '@/modules/tracks/enums';
import { useParams } from 'next/navigation';
import AcrCloudCard from './acr-cloud-card';
import ApprovalCard from './approval-card';
import CreateErrorsModal from './create-errors-modal';
import ReleaseErrorsCard from './release-errors-card';

export default function SystemReviewTab() {
    const params = useParams();
    const releaseId = params[PATH_PARAMS.RELEASE_ID]
        ? `${params[PATH_PARAMS.RELEASE_ID]}`
        : '';

    // Lấy dữ liệu thực tế của Release
    const { releaseData, isLoading: isReleaseLoading } =
        useGetDetailRelease(releaseId);

    // Lấy danh sách lỗi chất lượng
    const {
        releaseEnrichedErrorsData = [],
        isFetching: isFetchingEnrichedErrors,
    } = useReleaseEnrichedErrors({
        id: releaseId,
    });

    // Modal Store chung của hệ thống
    const typeModal = useModalStore((state) => state.typeModal);
    const closeModal = useModalStore((state) => state.closeModal);

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

    const unresolvedErrorsCount = releaseEnrichedErrorsData.filter(
        (err) => err.approvalStatus === RELEASE_ERROR_APPROVAL_STATUS.PENDING
    ).length;

    return (
        <div className="flex flex-col gap-6 pb-12">
            {/* CARD 1: KHUNG DUYỆT THỰC THI */}
            <ApprovalCard
                releaseId={releaseId}
                releaseEnrichedErrorsCount={unresolvedErrorsCount}
            />

            {/* CARD 1.5: KIỂM TRA LỖI CHẤT LƯỢNG (ENRICHED ERRORS) */}
            <ReleaseErrorsCard
                releaseId={releaseId}
                releaseEnrichedErrorsData={releaseEnrichedErrorsData}
                isFetchingEnrichedErrors={isFetchingEnrichedErrors}
            />

            {/* CARD 2: KẾT QUẢ QUÉT NHẠC TỪ ARC (ACRCLOUD) */}
            <AcrCloudCard tracks={tracksToShow} isLoading={isReleaseLoading} />

            {/* MODAL TẠO LỖI PHÁT HÀNH */}
            {typeModal === TYPE_MODAL_RELEASE.CREATE_ERROR && (
                <CreateErrorsModal
                    open
                    releaseId={releaseId}
                    onCancel={closeModal}
                />
            )}
        </div>
    );
}
