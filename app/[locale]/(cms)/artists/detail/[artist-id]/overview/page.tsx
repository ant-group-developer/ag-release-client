'use client';

import { SIZE_ICON } from '@/constants/common';
import { ORDER } from '@/enums/common';
import PlaysTimelineChart from '@/modules/analytics2/components/chart/plays-timeline-chart';
import RevenueTimelineChart from '@/modules/analytics2/components/chart/revenue-timeline-chart';
import ArtistProfileCard from '@/modules/artist/components/artist-detail/overview/card/artist-profile';
import StatItem from '@/modules/artist/components/artist-detail/overview/card/stat-item';
import { useGetDetailArtist } from '@/modules/artist/hooks/use-get-detail-artist';
import ListRelease from '@/modules/dashboard/components/list-release';
import { RELEASES_STATUS, RELEASES_TABLE_KEY } from '@/modules/releases/enums';
import { useGetListReleases } from '@/modules/releases/hooks/use-get-list-releases';
import { theme } from 'antd';
import dayjs from 'dayjs';
import { DiscAlbum, Music4, User } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';

type Props = {};

export default function Overview({}: Props) {
    const messages = useTranslations();
    const params = useParams();
    const artistId = params['artist-id'];
    const { artistData } = useGetDetailArtist(artistId as string);
    const { releasesData } = useGetListReleases(
        {
            artistId: artistId as string,
            status: RELEASES_STATUS.DISTRIBUTED,
            orderBy: ORDER.DESC,
            fieldOrder: RELEASES_TABLE_KEY.RELEASE_DATE,
        },
        {
            enabled: !!artistId,
        }
    );
    const { token } = theme.useToken();
    const statStyles = {
        backgroundColor: token.colorBgContainer,
    };
    const fromDate = dayjs().subtract(29, 'day').format('YYYY-MM-DD');
    const toDate = dayjs().format('YYYY-MM-DD');
    const chartHeight = 280;

    return (
        <div className="space-y-4 py-4">
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
                    icon={<Music4 size={SIZE_ICON} className="text-blue-500" />}
                    style={statStyles}
                />

                <StatItem
                    iconBgColor="bg-purple-50"
                    title={messages('artist.profiles')}
                    value={artistData?.artistProfiles?.length}
                    icon={<User size={SIZE_ICON} className="text-purple-500" />}
                    style={statStyles}
                />
            </div>

            <ArtistProfileCard artistData={artistData} />

            <div className="grid grid-cols-2 gap-4">
                <PlaysTimelineChart
                    fromDate={fromDate}
                    toDate={toDate}
                    chartHeight={chartHeight}
                />
                <RevenueTimelineChart
                    fromDate={fromDate}
                    toDate={toDate}
                    chartHeight={chartHeight}
                />
            </div>
            <div>
                <ListRelease data={releasesData.items.slice(0, 7)} />
            </div>
        </div>
    );
}
