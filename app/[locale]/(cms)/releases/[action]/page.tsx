'use client';

import ReleaseDetailForm from '@/modules/release-detail/release-detail-form';
import { useReleaseFormStore } from '@/modules/releases/hooks/releaseFormStore';
import { useEffect } from 'react';

export default function CoreDetail() {
    const formStore = useReleaseFormStore((state) => state.form);

    useEffect(() => {
        if (formStore) {
            formStore.resetFields();
        }
    }, [formStore]);

    return <div>{formStore && <ReleaseDetailForm form={formStore} />}</div>;
}
