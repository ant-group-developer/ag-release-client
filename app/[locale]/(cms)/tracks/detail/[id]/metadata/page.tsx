'use client';
import AppCard from '@/components/ant-music/app-card';
import { convertSecondsToHoursMinutes } from '@/helpers/common';
import ArtistItem from '@/modules/releases/components/release-detail/release-review/metadata-info/artist-item';
import MetadataInfoItem from '@/modules/releases/components/release-detail/release-review/metadata-info/metadata-info-item';
import { TrackArtistData } from '@/modules/track-artist/types';
import { useGetDetailTrack } from '@/modules/tracks/hooks/use-get-detail-tracks';
import { theme } from 'antd';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';

type Props = {};

export default function TrackMetadata({}: Props) {
    const messages = useTranslations();
    const params = useParams();
    const trackId = params['id'];
    const { trackData } = useGetDetailTrack(trackId as string);
    const { token } = theme.useToken();

    const styleCard = {
        backgroundColor: token.colorBgContainer,
        border: 0,
    };

    return (
        <div className="space-y-4">
            <AppCard
                style={styleCard}
                title={
                    <p className="text-lg">
                        {messages('track.label')} & {messages('artist.label')}
                    </p>
                }
            >
                <div className="space-y-2 px-4 pb-4">
                    <div className="grid grid-cols-2 gap-2">
                        <MetadataInfoItem label={messages('track.name')}>
                            {trackData?.title}
                        </MetadataInfoItem>
                        <MetadataInfoItem label={messages('release.version')}>
                            {trackData?.version}
                        </MetadataInfoItem>
                    </div>

                    <div>
                        <MetadataInfoItem label={messages('common.artist')}>
                            {trackData?.trackArtists?.map(
                                (
                                    trackArtists: TrackArtistData,
                                    index: number
                                ) => (
                                    <ArtistItem
                                        key={trackArtists?.id}
                                        data={{
                                            artist: trackArtists?.artist,
                                            role: trackArtists?.artistRole,
                                        }}
                                    />
                                )
                            )}
                        </MetadataInfoItem>
                    </div>
                </div>
            </AppCard>

            <AppCard
                title={<p className="text-lg">{messages('genre.label')}</p>}
                style={styleCard}
            >
                <div className="space-y-2 px-4 pb-4">
                    <div className="grid grid-cols-2 gap-2">
                        <MetadataInfoItem label={messages('genres.primary')}>
                            {trackData?.primaryGenre?.name}
                        </MetadataInfoItem>
                        <MetadataInfoItem label={messages('common.subGenres')}>
                            {trackData?.subGenre?.name}
                        </MetadataInfoItem>{' '}
                        <MetadataInfoItem
                            label={`${messages('trackOriginType.label')}`}
                        >
                            {trackData?.trackOriginType?.name}
                        </MetadataInfoItem>
                        <MetadataInfoItem
                            label={`${messages('trackType.label')}`}
                        >
                            {trackData?.trackType?.name}
                        </MetadataInfoItem>
                    </div>
                </div>
            </AppCard>

            <AppCard
                title={
                    <p className="text-lg">
                        {messages('release.otherMetadata')}
                    </p>
                }
                style={styleCard}
            >
                <div className="space-y-2 px-4 pb-4">
                    <div className="grid grid-cols-2 gap-2">
                        <MetadataInfoItem
                            label={`${messages('track.language')}`}
                        >
                            {trackData?.trackLanguage?.audioLanguage?.name}
                        </MetadataInfoItem>

                        <MetadataInfoItem
                            label={`${messages('formFields.pLine')}`}
                        >
                            {trackData?.pLineOwner}
                        </MetadataInfoItem>

                        <MetadataInfoItem
                            label={messages(
                                'formFields.tracks.isSensitiveContent'
                            )}
                        >
                            {trackData?.trackSensitive?.name}
                        </MetadataInfoItem>
                        <MetadataInfoItem
                            label={messages('formFields.tracks.preview')}
                        >
                            {convertSecondsToHoursMinutes(
                                Number(trackData?.preview)
                            )}
                        </MetadataInfoItem>

                        <MetadataInfoItem
                            label={messages('track.recordingCountry')}
                        >
                            {trackData?.trackLanguage?.recordingCountry?.name}
                        </MetadataInfoItem>
                        <MetadataInfoItem label={'ISRC'}>
                            {trackData?.isrc}
                        </MetadataInfoItem>
                        <div className="col-span-2">
                            <MetadataInfoItem
                                label={messages('formFields.tracks.lyrics')}
                            >
                                {trackData?.lyric}
                            </MetadataInfoItem>
                        </div>
                    </div>
                </div>
            </AppCard>
        </div>
    );
}
