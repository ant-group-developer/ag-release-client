import { TrackData } from '@/modules/tracks/types';
import AudioSpecSection from '../collapse/view-all-collapse/audio-spec-section';
import GenreSection from '../collapse/view-all-collapse/genre-section';
import LanguageSection from '../collapse/view-all-collapse/language-section';
import OtherSection from '../collapse/view-all-collapse/other-section';
import TrackAndArtistSection from '../collapse/view-all-collapse/track-and-artist-section';

type Props = {
    trackData: TrackData;
    updateTrackDraft: (data: any) => void;
    index: number;
};

export default function ViewAll({ index, trackData, updateTrackDraft }: Props) {
    
    return (
        <div className="flex flex-col gap-4">
            <TrackAndArtistSection
                trackData={trackData}
                debouncedUpdateTrackDraft={updateTrackDraft}
                index={index}
            />
            <GenreSection
                index={index}
                debouncedUpdateTrackDraft={updateTrackDraft}
                trackData={trackData}
            />
            <LanguageSection
                index={index}
                debouncedUpdateTrackDraft={updateTrackDraft}
                trackData={trackData}
            />
            <OtherSection
                index={index}
                debouncedUpdateTrackDraft={updateTrackDraft}
                trackData={trackData}
            />

            <AudioSpecSection
                index={index}
                debouncedUpdateTrackDraft={updateTrackDraft}
                trackData={trackData}
            />
        </div>
    );
}
