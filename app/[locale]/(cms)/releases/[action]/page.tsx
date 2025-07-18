'use client';
import ReleaseDetailForm from '@/modules/releases/components/release-detail/release-detail-form';
import { useReleaseFormStore } from '@/modules/releases/hooks/release-form-store';
import { useEffect } from 'react';

export default function CoreDetailCreate() {
    const resetFormValues = useReleaseFormStore(
        (state) => state.resetFormValues
    );

    useEffect(() => {
        resetFormValues();
    }, []);

    return (
        <div>
            <ReleaseDetailForm />
        </div>
    );
}
