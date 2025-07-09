'use client';
import ReleaseSchedulingForm from '@/modules/release-detail/release-scheduling/form';
import ReleaseSchedulingTable from '@/modules/release-detail/release-scheduling/table';
import { useReleaseFormStore } from '@/modules/releases/hooks/release-form-store';

export default function Schedule() {
    const formValues = useReleaseFormStore((state) => state.formValues);

    const trackData = formValues?.tracks?.map((track) => {
        return {
            key: track.id,
            track: track.title,
            priceCode: '0.99',
            tikTokPolicy: 'Allowed',
            facebookPolicy: 'Monetized',
            youtubePolicy: 'Standard License',
        };
    });

    return (
        <div>
            <ReleaseSchedulingForm />
            <ReleaseSchedulingTable dataSource={trackData} />
        </div>
    );
}
