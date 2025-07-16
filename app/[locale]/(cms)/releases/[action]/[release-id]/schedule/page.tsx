'use client';
import ReleaseSchedulingForm from '@/modules/releases/components/release-detail/release-scheduling/form';
import ReleaseSchedulingTable from '@/modules/releases/components/release-detail/release-scheduling/table';
import { useReleaseFormStore } from '@/modules/releases/hooks/release-form-store';
import { useGetListTracks } from '@/modules/tracks/hooks/use-get-list-tracks';
import { TrackData } from '@/modules/tracks/types';

export default function Schedule() {
    const formValues = useReleaseFormStore((state) => state.formValues);

    const { tracksData } = useGetListTracks({ releaseId: formValues.id });

    const trackData = tracksData.items.map((track: TrackData) => {
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
