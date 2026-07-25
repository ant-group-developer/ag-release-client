'use client';

import { SIZE_ICON } from '@/constants/common';
import { ORDER } from '@/enums/common';
import { formattedNumber } from '@/helpers/common';
import ArtistProfileCard from '@/modules/artist/components/artist-detail/overview/card/artist-profile';
import StatItem from '@/modules/artist/components/artist-detail/overview/card/stat-item';
import { useGetDetailArtist } from '@/modules/artist/hooks/use-get-detail-artist';
import ListRelease from '@/modules/dashboard/components/list-release';
import { RELEASES_STATUS, RELEASES_TABLE_KEY } from '@/modules/releases/enums';
import { useGetListReleases } from '@/modules/releases/hooks/use-get-list-releases';
import { theme } from 'antd';
import dayjs from 'dayjs';
import { DiscAlbum, DollarSign, Eye, Music, Music4 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { useMemo, useState } from 'react';

import DateSelect2 from '@/components/ui/select/date-select2';
import ArtistAnalyticsOverviewChart from '@/modules/analytics2/components/chart/artist-analytics-overview-chart';
import MetricHeaderTabs, {
    MetricHeaderTabItem,
} from '@/modules/analytics2/components/metric-header-tabs';
import { ANALYTICS_METRIC_KEY } from '@/modules/analytics2/enums';
import { useGetArtistSummary } from '@/modules/analytics2/hooks/use-get-artist-summary';

type Props = {};

export default function Overview({}: Props) {
    const messages = useTranslations();
    const params = useParams();
    const artistId = params['artist-id'];
    const { artistData } = useGetDetailArtist(artistId as string);
    const { releasesData, isLoading } = useGetListReleases(
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

    const defaultFromDate = useMemo(
        () => dayjs().subtract(12, 'month').format('YYYY-MM-DD'),
        []
    );
    const defaultToDate = useMemo(() => dayjs().format('YYYY-MM-DD'), []);

    const [localFromDate, setLocalFromDate] = useState(defaultFromDate);
    const [localToDate, setLocalToDate] = useState(defaultToDate);
    const [activeMetric, setActiveMetric] = useState<string>(
        ANALYTICS_METRIC_KEY.TOTAL_VIEWS
    );

    const handleMetricChange = (key: string) => {
        setActiveMetric(key);
    };

    // Gọi API lấy thông tin tổng quan summary của Artist
    const { artistSummaryData } = useGetArtistSummary(
        artistId as string,
        { fromDate: localFromDate, toDate: localToDate },
        !!artistId
    );

    const metricTabItems: MetricHeaderTabItem[] = [
        {
            key: ANALYTICS_METRIC_KEY.TOTAL_VIEWS,
            label: 'Total views',
            value: formattedNumber(artistSummaryData?.totalTrendViews),
            icon: Eye,
            color: 'text-emerald-600 dark:text-emerald-400',
            bgColor: 'bg-emerald-100/50 dark:bg-emerald-900/30',
        },
        {
            key: ANALYTICS_METRIC_KEY.TOTAL_USAGE,
            label: 'Total Usage',
            value: formattedNumber(artistSummaryData?.totalUsage),
            icon: Music,
            color: 'text-purple-600 dark:text-purple-400',
            bgColor: 'bg-purple-100/50 dark:bg-purple-900/30',
        },
        {
            key: ANALYTICS_METRIC_KEY.TOTAL_REVENUE_USD,
            label: 'Total Revenue',
            value: formattedNumber(artistSummaryData?.totalRevenueUsd),
            icon: DollarSign,
            color: 'text-cyan-600 dark:text-cyan-400',
            bgColor: 'bg-cyan-100/50 dark:bg-cyan-900/30',
        },
    ];

    return (
        <div className="space-y-6 py-4">
            <div className="grid grid-cols-2 gap-4">
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
            </div>

            <ArtistProfileCard artistData={artistData} />

            <div className="mt-6 flex w-full items-center justify-between">
                <span className="text-base font-bold text-gray-900 dark:text-zinc-100">
                    {messages('analytics.detailTitle')}
                </span>
                <DateSelect2
                    style={{ width: 240, height: 32 }}
                    value={`${localFromDate},${localToDate}`}
                    onChange={(value) => {
                        const [startDate, endDate] = value
                            .toString()
                            .split(',');
                        setLocalFromDate(startDate);
                        setLocalToDate(endDate);
                    }}
                    picker="date"
                />
            </div>

            <div className="mb-6 flex flex-col rounded-lg border">
                <MetricHeaderTabs
                    items={metricTabItems}
                    activeKey={activeMetric}
                    onChangeKey={handleMetricChange}
                />
                <ArtistAnalyticsOverviewChart
                    artistId={artistId as string}
                    fromDate={localFromDate}
                    toDate={localToDate}
                    activeMetric={activeMetric}
                    enabled={!!artistId}
                />
            </div>

            <div>
                <ListRelease
                    data={releasesData?.items?.slice(0, 7) ?? []}
                    loading={isLoading}
                />
            </div>
        </div>
    );
}
