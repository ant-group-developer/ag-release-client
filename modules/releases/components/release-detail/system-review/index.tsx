'use client';

import { PATH_PARAMS } from '@/enums/routes';
import useModalStore from '@/hooks/use-modal';
import {
    RELEASE_ERROR_APPROVAL_STATUS,
    TYPE_MODAL_RELEASE,
} from '@/modules/releases/enums';
import { useReleaseEnrichedErrors } from '@/modules/releases/hooks/use-release-enriched-errors';
import { useParams } from 'next/navigation';
import ApprovalCard from './approval-card';
import CreateErrorsModal from './create-errors-modal';
import ReleaseErrorsTable from './release-errors-table';

export default function SystemReviewTab() {
    const params = useParams();
    const releaseId = params[PATH_PARAMS.RELEASE_ID]
        ? `${params[PATH_PARAMS.RELEASE_ID]}`
        : '';

    // Lấy dữ liệu thực tế của Release
    // const { releaseData, isLoading: isReleaseLoading } =
    //     useGetDetailRelease(releaseId);

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

    const unresolvedErrorsCount = releaseEnrichedErrorsData.filter(
        (err) => err.approvalStatus === RELEASE_ERROR_APPROVAL_STATUS.PENDING
    ).length;

    return (
        <div className="flex flex-col gap-4 pb-12">
            {/* CARD 1: KHUNG DUYỆT THỰC THI */}
            <ApprovalCard
                releaseId={releaseId}
                releaseEnrichedErrorsCount={unresolvedErrorsCount}
            />

            {/* BẢNG KIỂM TRA LỖI CHẤT LƯỢNG (ENRICHED ERRORS) */}
            <ReleaseErrorsTable
                data={releaseEnrichedErrorsData}
                isLoading={isFetchingEnrichedErrors}
            />

            {/* CARD 2: KẾT QUẢ QUÉT NHẠC TỪ ARC (ACRCLOUD) */}
            {/* <AcrCloudCard tracks={tracksToShow} isLoading={isReleaseLoading} /> */}

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
