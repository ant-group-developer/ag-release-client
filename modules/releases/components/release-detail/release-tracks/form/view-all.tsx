import { TrackData } from '@/modules/tracks/types';
import { useTranslations } from 'next-intl';
import TrackAndArtistSection from '../collapse/view-all-collapse/track-and-artist-section';

type Props = {
    trackData: TrackData;
    updateTrackDraft: (data: any) => void;
    index: number;
};

export default function ViewAll({ index, trackData, updateTrackDraft }: Props) {
    const messages = useTranslations();
    return (
        <div>
            <TrackAndArtistSection
                trackData={trackData}
                debouncedUpdateTrackDraft={updateTrackDraft}
                index={index}
            />
        </div>
    );
}
