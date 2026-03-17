'use client';
import { useReleaseDistribute } from '@/modules/distribution/hooks/use-release-distribute';
import { useGetListReleaseDsp } from '@/modules/release-dsp/hooks/use-get-list-release-dsp';
import ReleaseDetailFormV2 from '@/modules/releases/components/release-detail/release-detail-form/ReleaseDetailFormV2';
import { useParams } from 'next/navigation';
import { useEffect } from 'react';

export default function CoreDetail() {
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
        setSelectedRow(releaseDsp?.items ?? []);
    }, [releaseDsp, setSelectedRow]);

    return <ReleaseDetailFormV2 />;
}
