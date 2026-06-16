import { DATE_FORMAT } from '@/enums/common';
import { APP_ROUTES } from '@/enums/routes';
import { formattedNumber } from '@/helpers/common';
import { Link } from '@/i18n/routing';
import { useGetTrendViewSummary } from '@/modules/analytics2/hooks/use-get-trend-view-summary';
import { theme } from 'antd';
import dayjs from 'dayjs';
import { BarChart3, Building2, DiscAlbum, Music, Users } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';
import { useGetCountOverview } from '../../hooks/use-get-count';
import { DashboardDataFilter } from '../../types';

type Props = {
    params: DashboardDataFilter;
};

export default function StatsOverview({ params }: Props) {
    const messages = useTranslations();
    const { token } = theme.useToken();
    const { countOverviewData: overviewData, isFetching: isOverviewLoading } =
        useGetCountOverview(params);
    const trendViewSummaryParams = useMemo(
        () => ({
            fromDate: params.startDate
                ? dayjs(params.startDate).format(DATE_FORMAT.MYSQL_TYPE_DATE)
                : '',
            toDate: params.endDate
                ? dayjs(params.endDate).format(DATE_FORMAT.MYSQL_TYPE_DATE)
                : '',
        }),
        [params.endDate, params.startDate]
    );
    const { trendViewSummaryData, isFetching: isTrendViewSummaryLoading } =
        useGetTrendViewSummary(trendViewSummaryParams);

    const overviewCount = [
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
            // trend: '+12%',
            // trendColor: 'text-cyan-500',
            // chartData: [20, 30, 25, 35, 50],
            // chartColor: '#a855f7', // purple-500
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
            // trend: '+5.4%',
            // trendColor: 'text-cyan-500',
            // chartData: [25, 40, 30, 45, 60],
            // chartColor: '#22d3ee', // cyan-400
        },
        {
            label: messages('label.label'),
            count: overviewData?.labelsCount,
            icon: Building2,
            color: 'text-pink-600 dark:text-pink-400',
            bgColor: 'bg-pink-100/50 dark:bg-pink-900/30',
            href: APP_ROUTES.LABELS,
            isLoading: isOverviewLoading,
            // trend: 'Stable',
            // trendColor: 'text-gray-400',
            // chartData: [40, 40, 40, 40, 40],
            // chartColor: '#db2777', // pink-600
        },
        {
            label: messages('artist.label'),
            count: overviewData?.artistsCount,
            icon: Users,
            color: 'text-indigo-600 dark:text-indigo-400',
            bgColor: 'bg-indigo-100/50 dark:bg-indigo-900/30',
            href: APP_ROUTES.ARTISTS,
            isLoading: isOverviewLoading,
            // trend: '+3',
            // trendColor: 'text-cyan-500',
            // chartData: [30, 40, 35, 45, 55],
            // chartColor: '#6366f1', // indigo-500
        },
    ];

    return (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-5">
            {overviewCount?.map((item, index) => {
                const Icon = item.icon;
                return (
                    <div
                        key={index}
                        className="rounded-lg border border-gray-100 p-5 shadow-sm transition-all hover:shadow-md dark:border-zinc-800"
                        style={{ backgroundColor: token.colorBgContainer }}
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex flex-col gap-1">
                                <span className="text-xs font-medium uppercase text-gray-400 dark:text-zinc-500">
                                    {item?.label}
                                </span>
                                {item.isLoading ? (
                                    <div className="mt-1 h-7 w-20 animate-pulse rounded bg-gray-200 dark:bg-zinc-700" />
                                ) : (
                                    <>
                                        {item.href ? (
                                            <Link
                                                href={item.href}
                                                className="w-fit text-2xl font-bold transition-colors hover:text-blue-500"
                                            >
                                                <span className="hover:text-blue-500">
                                                    {formattedNumber(
                                                        item?.count
                                                    )}
                                                </span>
                                            </Link>
                                        ) : (
                                            <span className="w-fit text-2xl font-bold">
                                                {formattedNumber(item?.count)}
                                            </span>
                                        )}
                                        {typeof item.importCount ===
                                            'number' && (
                                            <span className="text-xs text-gray-400 dark:text-zinc-500">
                                                {messages(
                                                    'common.importedFromReport'
                                                )}
                                                :{' '}
                                                {formattedNumber(
                                                    item.importCount
                                                )}
                                            </span>
                                        )}
                                    </>
                                )}
                            </div>
                            <div
                                className={`rounded-xl p-3 ${item.bgColor} ${item.color}`}
                            >
                                <Icon size={24} />
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
