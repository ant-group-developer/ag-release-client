'use client';
import { useReleaseDistribute } from '@/modules/distribution/hooks/use-release-distribute';
import { useGetListReleaseDsp } from '@/modules/release-dsp/hooks/use-get-list-release-dsp';
import ReleaseDetailFormV2 from '@/modules/releases/components/release-detail/release-detail-form/release-detail-form-v2';
import { useReleaseFormStore } from '@/modules/releases/hooks/release-form-store';
import { useParams } from 'next/navigation';
import { useEffect } from 'react';

export default function CoreDetailCreate() {
    const resetFormValues = useReleaseFormStore(
        (state) => state.resetFormValues
    );

    const setSelectedRow = useReleaseDistribute(
        (state) => state.setSelectedRows
    );
    const params = useParams();
    const releaseId = params['release-id'] as string;
    const { releaseDsp } = useGetListReleaseDsp(releaseId, {
        page: 1,
        pageSize: 999,
    });

    useEffect(() => {
        setSelectedRow(
            releaseDsp?.items?.filter((item) => item.isSelected) ?? []
        );
    }, [releaseDsp, setSelectedRow]);

    useEffect(() => {
        resetFormValues();
    }, []);

    return <ReleaseDetailFormV2 />;
}
