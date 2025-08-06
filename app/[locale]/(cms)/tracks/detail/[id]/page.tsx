'use client';
import AppHeaderPage from '@/components/ant-music/app-header-page';
import {
    FEATURING_ARTIST_ROLE,
    MAIN_ARTIST_ROLE,
} from '@/modules/release-artist/constants';
import AudioFile from '@/modules/tracks/components/track-detail/audio-file';
import TrackMetadata from '@/modules/tracks/components/track-detail/track-metadata';
import { TRACK_TABS } from '@/modules/tracks/enums';
import { useGetDetailTrack } from '@/modules/tracks/hooks/use-get-detail-tracks';
import { TabsProps } from 'antd';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';

type Props = {};

export default function TrackDetail({}: Props) {
    // hooks - state
    const messages = useTranslations();

    // params
    const params = useParams();
    const trackId = params['id'];

    // apis
    const { trackData } = useGetDetailTrack(trackId as string);

    // const
    const itemTabs: TabsProps['items'] = [
        {
            key: TRACK_TABS.METADATA,
            label: 'Metadata',
            children: <TrackMetadata trackData={trackData} />,
        },
        {
            key: TRACK_TABS.AUDIO_FILE,
            label: 'Audio File',
            children: <AudioFile trackData={trackData} />,
        },
    ];
    const trackArtist = trackData?.trackArtists;
    const trackMainArtist = trackArtist?.find(
        (item) => item?.artistRole?.value === MAIN_ARTIST_ROLE
    );
    const featuringArtist = trackArtist?.filter(
        (item) => item.artistRole?.value === FEATURING_ARTIST_ROLE
    );

    return (
        <div className="h-[calc(100vh-4rem)]">
            <div className="sticky top-0 z-10">
                <AppHeaderPage imageSrc="" itemTabs={itemTabs}>
                    <div className="text-sm">
                        <span>{messages('tracks.name')}: </span>
                        <span className="font-bold">
                            {trackData.title}{' '}
                            {trackData.version &&
                                trackData.title &&
                                `[${trackData.version}]`}
                        </span>
                    </div>
                    <div className="text-sm">
                        <span>{messages('artist.label')}: </span>
                        <span className="font-bold">
                            {trackMainArtist?.artist?.name}{' '}
                            {featuringArtist && featuringArtist?.length > 0 && (
                                <span>{`(feat. ${featuringArtist.map((item) => item.artist?.name).join(' & ')})`}</span>
                            )}
                        </span>
                    </div>
                    <div className="text-sm">
                        <span>{messages('common.genres')}: </span>
                        <span className="font-bold">
                            {trackData?.primaryGenre?.name}
                        </span>
                    </div>
                    {trackData.isrc && (
                        <div>
                            <span>ISRC: </span>
                            <span className="font-bold">{trackData.isrc}</span>
                        </div>
                    )}
                </AppHeaderPage>
            </div>
            <div className=""></div>
        </div>
    );
}
