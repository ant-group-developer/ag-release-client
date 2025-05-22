'use client';

import { useRouter } from '@/i18n/routing';
import ReleaseDetailForm from '@/modules/release-detail/release-detail-form';
import { useReleaseFormStore } from '@/modules/releases/hooks/releaseFormStore';
import { useEffect } from 'react';

export default function CoreDetail() {
    const router = useRouter();
    const formStore = useReleaseFormStore((state) => state.form);
    const fakeIdRelease = 'id-123-456-789';

    const handleSubmit = async () => {
        try {
            router.push(`/releases/detail/${fakeIdRelease}/core-detail`);
        } catch (error) {
            console.error('Lỗi khi xác thực form:', error);
        }
    };

    useEffect(() => {
        if (formStore) {
            formStore.resetFields();
        }
    }, [formStore]);

    return (
        <div>
            {formStore && <ReleaseDetailForm form={formStore} />}

            {/* <div className="flex justify-end p-4">
                <Button type="primary" onClick={handleSubmit}>
                    Lưu thông tin
                </Button>
            </div> */}
        </div>
    );
}
