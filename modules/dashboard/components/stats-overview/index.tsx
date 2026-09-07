import { DATE_FORMAT } from '@/enums/common';
import { APP_ROUTES } from '@/enums/routes';
import { useGetTrendViewSummary } from '@/modules/analytics2/hooks/use-get-trend-view-summary';
import { AnalyticsCommonParams } from '@/modules/analytics2/types';
import dayjs from 'dayjs';
import { BarChart3, Building2, DiscAlbum, Music, Users } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';
import { useGetCountOverview } from '../../hooks/use-get-count';
import StatOverviewCard, { StatOverviewItem } from './stat-overview-card';

type Props = {
    params: AnalyticsCommonParams;
};

export default function StatsOverview({ params }: Props) {
    const messages = useTranslations();
    const { countOverviewData: overviewData, isFetching: isOverviewLoading } =
        useGetCountOverview(params);
    const trendViewSummaryParams = useMemo(
        () => ({
            fromDate: params.fromDate
                ? dayjs(params.fromDate).format(DATE_FORMAT.MYSQL_TYPE_DATE)
                : '',
            toDate: params.toDate
                ? dayjs(params.toDate).format(DATE_FORMAT.MYSQL_TYPE_DATE)
                : '',
            releaseType: params.releaseType,
        }),
        [params.toDate, params.fromDate, params.releaseType]
    );
    const { trendViewSummaryData, isFetching: isTrendViewSummaryLoading } =
        useGetTrendViewSummary(trendViewSummaryParams);

    const overviewCount: StatOverviewItem[] = [
        {
            label: messages('analytics.totalTrendViews'),
            count: trendViewSummaryData?.totalViews,
            icon: BarChart3,
            color: 'text-emerald-600 dark:text-emerald-400',
            bgColor: 'bg-emerald-100/50 dark:bg-emerald-900/30',
            isLoading: isTrendViewSummaryLoading,
        },
        {
            label: messages('release.label'),
            count: overviewData?.releasesCount,
            importCount: overviewData?.releasesImportCount,
            icon: DiscAlbum,
            color: 'text-purple-600 dark:text-purple-400',
            bgColor: 'bg-purple-100/50 dark:bg-purple-900/30',
            href: APP_ROUTES.RELEASES,
            isLoading: isOverviewLoading,
        },
        {
            label: messages('track.label'),
            count: overviewData?.tracksCount,
            importCount: overviewData?.tracksImportCount,
            icon: Music,
            color: 'text-cyan-600 dark:text-cyan-400',
            bgColor: 'bg-cyan-100/50 dark:bg-cyan-900/30',
            href: APP_ROUTES.TRACKS,
            isLoading: isOverviewLoading,
        },
        {
            label: messages('label.label'),
            count: overviewData?.labelsCount,
            icon: Building2,
            color: 'text-pink-600 dark:text-pink-400',
            bgColor: 'bg-pink-100/50 dark:bg-pink-900/30',
            href: APP_ROUTES.LABELS,
            isLoading: isOverviewLoading,
        },
        {
            label: messages('artist.label'),
            count: overviewData?.artistsCount,
            icon: Users,
            color: 'text-indigo-600 dark:text-indigo-400',
            bgColor: 'bg-indigo-100/50 dark:bg-indigo-900/30',
            href: APP_ROUTES.ARTISTS,
            isLoading: isOverviewLoading,
        },
    ];

    const importLabel = messages('common.importedFromReport');

    return (
        <div className="grid grid-cols-2 gap-2 sm:gap-3 md:gap-3.5 lg:grid-cols-5">
            {overviewCount?.map((item, index) => (
                <StatOverviewCard
                    key={index}
                    item={item}
                    importLabel={importLabel}
                />
            ))}
        </div>
    );
}
