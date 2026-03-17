'use client';
import ReleaseDetailFormV2 from '@/modules/releases/components/release-detail/release-detail-form/ReleaseDetailFormV2';
import { useReleaseFormStore } from '@/modules/releases/hooks/release-form-store';
import { useEffect } from 'react';

export default function CoreDetailCreate() {
    const resetFormValues = useReleaseFormStore(
        (state) => state.resetFormValues
    );

    useEffect(() => {
        resetFormValues();
    }, []);

    return <ReleaseDetailFormV2 />;
}
