'use client';
import MetadataInfo from '@/modules/releases/components/release-detail/release-review/metadata-info';
import ReviewProgress from '@/modules/releases/components/release-detail/release-review/review-progress';
import TracksInfo from '@/modules/releases/components/release-detail/release-review/tracks-info/page';
import { useReleaseFormStore } from '@/modules/releases/hooks/release-form-store';
import { useTranslations } from 'next-intl';

export default function Review() {
    const messages = useTranslations();
    const formValues = useReleaseFormStore((state) => state.formValues);
    const setValidationErrors = useReleaseFormStore(
        (state) => state.setValidationErrors
    );

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
