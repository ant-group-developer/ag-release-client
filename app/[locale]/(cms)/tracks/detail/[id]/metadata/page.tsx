'use client';
import { convertSecondsToHoursMinutes } from '@/helpers/common';
import ArtistItem from '@/modules/releases/components/release-detail/release-review/metadata-info/artist-item';
import MetadataInfoItem from '@/modules/releases/components/release-detail/release-review/metadata-info/metadata-info-item';
import { TrackArtistData } from '@/modules/track-artist/types';
import { useGetDetailTrack } from '@/modules/tracks/hooks/use-get-detail-tracks';
import { Collapse, CollapseProps } from 'antd';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';

type Props = {};

export default function TrackMetadata({}: Props) {
    const messages = useTranslations();
    const params = useParams();
    const trackId = params['id'];
    const { trackData } = useGetDetailTrack(trackId as string);

    const items: CollapseProps['items'] = [
        {
            key: 'track-artist',
            label: 'Track & Artist',
            children: (
                <div className="space-y-2">
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
                                (
                                    trackArtists: TrackArtistData,
                                    index: number
                                ) => (
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
                </div>
            ),
        },
        {
            key: 'genre',
            label: 'Genres',
            children: (
                <div className="space-y-2">
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
            ),
        },
        {
            key: 'other',
            label: 'Other metadata',
            children: (
                <div className="space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                        <MetadataInfoItem
                            label={`${messages('tracks.language')}`}
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
                            {trackData?.isSensitiveContent}
                        </MetadataInfoItem>
                        <MetadataInfoItem
                            label={messages('formFields.tracks.preview')}
                        >
                            {convertSecondsToHoursMinutes(
                                Number(trackData?.preview)
                            )}
                        </MetadataInfoItem>

                        <MetadataInfoItem
                            label={messages('tracks.recordingCountry')}
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
            ),
        },
    ];

    return (
        <div className="space-y-2 px-80">
            <Collapse
                items={items}
                defaultActiveKey={['track-artist', 'genre', 'other']}
            />
        </div>
    );
}
