import { convertSecondsToHoursMinutes } from '@/helpers/common';
import ArtistItem from '@/modules/releases/components/release-detail/release-review/metadata-info/artist-item';
import MetadataInfoItem from '@/modules/releases/components/release-detail/release-review/metadata-info/metadata-info-item';
import { TrackArtistData } from '@/modules/track-artist/types';
import { useTranslations } from 'next-intl';
import { TrackData } from '../../types';

type Props = {
    trackData: TrackData;
};

export default function TrackMetadata({ trackData }: Props) {
    const messages = useTranslations();
    return (
        <div className="h-[70vh] space-y-2 overflow-y-auto px-80 pb-8">
            {/* <p className="font-semibold">MetaData</p> */}

            <div className="grid grid-cols-2 gap-2">
                <MetadataInfoItem label={messages('tracks.name')}>
                    {trackData?.title}
                </MetadataInfoItem>
                <MetadataInfoItem label={messages('releases.version')}>
                    {trackData?.version}
                </MetadataInfoItem>
            </div>

            <div>
                <MetadataInfoItem label={messages('common.artist')}>
                    {trackData?.trackArtists?.map(
                        (trackArtists: TrackArtistData, index: number) => (
                            <ArtistItem
                                key={index}
                                data={{
                                    artist: trackArtists?.artist,
                                    role: trackArtists?.artistRole,
                                }}
                            />
                        )
                    )}
                </MetadataInfoItem>
            </div>

            <div className="grid grid-cols-2 gap-2">
                <MetadataInfoItem label={messages('genres.primary')}>
                    {trackData?.primaryGenre?.name}
                </MetadataInfoItem>
                <MetadataInfoItem label={messages('common.subGenres')}>
                    {trackData?.subGenre?.name}
                </MetadataInfoItem>
            </div>

            <div>
                <MetadataInfoItem label={`${messages('tracks.language')}`}>
                    {trackData?.trackLanguage?.audioLanguage?.name}
                </MetadataInfoItem>
            </div>

            <div className="grid grid-cols-2 gap-2">
                <MetadataInfoItem
                    label={`${messages('trackOriginType.label')}`}
                >
                    {trackData?.trackOriginType?.name}
                </MetadataInfoItem>

                <MetadataInfoItem label={`${messages('trackType.label')}`}>
                    {trackData?.trackType?.name}
                </MetadataInfoItem>
            </div>

            <div>
                <MetadataInfoItem label={`${messages('formFields.pLine')}`}>
                    {trackData?.pLineOwner}
                </MetadataInfoItem>
            </div>

            <div className="grid grid-cols-2 gap-2">
                <MetadataInfoItem
                    label={messages('formFields.tracks.isSensitiveContent')}
                >
                    {trackData?.isSensitiveContent}
                </MetadataInfoItem>
                <MetadataInfoItem label={messages('formFields.tracks.preview')}>
                    {convertSecondsToHoursMinutes(Number(trackData?.preview))}
                </MetadataInfoItem>
            </div>

            <div>
                <MetadataInfoItem label={messages('tracks.recordingCountry')}>
                    {trackData?.trackLanguage?.recordingCountry?.name}
                </MetadataInfoItem>
            </div>
        </div>
    );
}
