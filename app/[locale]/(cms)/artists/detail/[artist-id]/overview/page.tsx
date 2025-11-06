'use client';

import { SIZE_ICON } from '@/constants/common';
import RevenueAnalysisCard from '@/modules/artist/components/artist-detail/overview/card/revenue-analysis';
import StatItem from '@/modules/artist/components/artist-detail/overview/card/stat-item';
import StreamsAnalysisCard from '@/modules/artist/components/artist-detail/overview/card/streams-analysis';
import { useGetDetailArtist } from '@/modules/artist/hooks/use-get-detail-artist';
import { theme } from 'antd';
import { Disc2, DiscAlbum, Music4 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';

type Props = {};

export default function Overview({}: Props) {
    const messages = useTranslations();
    const params = useParams();
    const artistId = params['artist-id'];
    const { artistData } = useGetDetailArtist(artistId as string);
    const { token } = theme.useToken();
    const statStyles = {
        backgroundColor: token.colorBgContainer,
    };

    return (
        <div className="py-4">
            <div className="grid grid-cols-3 gap-4">
                <StatItem
                    iconBgColor="bg-green-50"
                    title={messages('release.count')}
                    value={artistData?.releaseCount}
                    icon={
                        <DiscAlbum
                            size={SIZE_ICON}
                            className="text-green-500"
                        />
                    }
                    style={statStyles}
                />

                <StatItem
                    iconBgColor="bg-blue-50"
                    title={messages('track.count')}
                    value={artistData?.trackCount}
                    icon={<Disc2 size={SIZE_ICON} className="text-blue-500" />}
                    style={statStyles}
                />

                <StatItem
                    iconBgColor="bg-purple-50"
                    title={messages('artist.profiles')}
                    value={artistData?.artistProfiles?.length}
                    icon={
                        <Music4 size={SIZE_ICON} className="text-purple-500" />
                    }
                    style={statStyles}
                />

                {/* <ArtistProfileCard artistData={artistData} /> */}
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4">
                <StreamsAnalysisCard />
                <RevenueAnalysisCard />
            </div>
            <div>
                {/* <ListRelease data={fakeReleasesData.slice(0, 7)} /> */}
            </div>
        </div>
    );
}
