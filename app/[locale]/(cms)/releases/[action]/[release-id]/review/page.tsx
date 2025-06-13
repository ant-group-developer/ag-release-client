'use client';
import MetadataInfo from '@/modules/release-detail/release-review/metadata-info';
import ReviewProgress from '@/modules/release-detail/release-review/review-progress';
import TracksInfo from '@/modules/release-detail/release-review/tracks-info/page';
import { useReleaseFormStore } from '@/modules/releases/hooks/releaseFormStore';
import { releaseSchema } from '@/modules/releases/schemas/schema';
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';

export default function Review() {
    const messages = useTranslations();
    const formValues = useReleaseFormStore((state) => state.formValues);
    const setValidationErrors = useReleaseFormStore(
        (state) => state.setValidationErrors
    );

    useEffect(() => {
        // Thực hiện xác thực
        const validationResult = releaseSchema(messages as any).safeParse(
            formValues
        );

        if (!validationResult.success) {
            console.error('Các trường chưa được xác thực:');
            console.log(validationResult);
            setValidationErrors(validationResult.error.errors);
        } else {
            console.log('Tất cả các trường đã được xác thực thành công.');
            setValidationErrors([]);
        }
    }, [formValues]);

    return (
        <div className="flex flex-col gap-8 p-4">
            <ReviewProgress />

            <div className="grid grid-cols-2 gap-1">
                <MetadataInfo />
                <TracksInfo />
            </div>
        </div>
    );
}
