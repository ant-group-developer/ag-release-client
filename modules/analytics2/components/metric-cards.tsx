import { useGetCountOverview } from '@/modules/dashboard/hooks/use-get-count';
import { Space, theme } from 'antd';
import { Building2, DiscAlbum, Music, Users } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface Props {
    fromDate: string;
    toDate: string;
}

const IconMap: Record<string, any> = {
    release: DiscAlbum,
    track: Music,
    label: Building2,
    artist: Users,
};

const ColorMap: Record<string, { color: string; bgColor: string }> = {
    release: {
        color: 'text-purple-600 dark:text-purple-400',
        bgColor: 'bg-purple-100/50 dark:bg-purple-900/30',
    },
    track: {
        color: 'text-cyan-600 dark:text-cyan-400',
        bgColor: 'bg-cyan-100/50 dark:bg-cyan-900/30',
    },
    label: {
        color: 'text-pink-600 dark:text-pink-400',
        bgColor: 'bg-pink-100/50 dark:bg-pink-900/30',
    },
    artist: {
        color: 'text-indigo-600 dark:text-indigo-400',
        bgColor: 'bg-indigo-100/50 dark:bg-indigo-900/30',
    },
};

export default function MetricCards({ fromDate, toDate }: Props) {
    const t = useTranslations();
    const { token } = theme.useToken();

    const { countOverviewData, isFetching: isOverviewLoading } =
        useGetCountOverview({ startDate: fromDate, endDate: toDate });


    const metricsData = [
        {
            title: 'Release',
            value: countOverviewData?.releasesCount ?? 0,
            change: '+12%',
            isPositive: true,
        },
        {
            title: 'Track',
            value: countOverviewData?.tracksCount ?? 0,
            change: '+5.4%',
            isPositive: true,
        },
        {
            title: 'Label',
            value: countOverviewData?.labelsCount ?? 0,
            change: 'Stable',
            isPositive: false,
        },
        {
            title: 'Artist',
            value: countOverviewData?.artistsCount ?? 0,
            change: '+3',
            isPositive: true,
        },
    ];

    const getTranslatedTitle = (title: string) => {
        const key = title.toLowerCase();
        if (key === 'release') return t('release.label');
        if (key === 'track') return t('track.label');
        if (key === 'label') return t('label.label');
        if (key === 'artist') return t('artist.label');
        return title;
    };

    return (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            {metricsData.map((metric, index) => {
                const titleLower = metric.title.toLowerCase();
                const Icon = IconMap[titleLower] || Music;
                const themeColors = ColorMap[titleLower] || {
                    color: 'text-blue-600 dark:text-blue-400',
                    bgColor: 'bg-blue-100/50 dark:bg-blue-900/30',
                };
                const trendColor = metric.isPositive
                    ? 'text-cyan-500'
                    : 'text-gray-400';

                return (
                    <div
                        key={index}
                        className="rounded-lg border border-gray-100 p-5 shadow-sm transition-all hover:shadow-md dark:border-zinc-800"
                        style={{ backgroundColor: token.colorBgContainer }}
                    >
                        <div className="flex items-center justify-between">
                            <Space size={12}>
                                <div
                                    className={`rounded-xl p-2.5 ${themeColors.bgColor} ${themeColors.color}`}
                                >
                                    <Icon size={24} />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-xs font-medium uppercase text-gray-400 dark:text-zinc-500">
                                        {getTranslatedTitle(metric.title)}
                                    </span>
                                    {isOverviewLoading ? (
                                        <div className="mt-1.5 h-6 w-20 animate-pulse rounded bg-gray-200 dark:bg-zinc-700" />
                                    ) : (
                                        <span className="text-xl font-bold">
                                            {metric.value}
                                        </span>
                                    )}
                                </div>
                            </Space>
                            {!isOverviewLoading && (
                                <div
                                    className={`text-[14px] font-semibold ${trendColor}`}
                                >
                                    {metric.change.includes('+') ? (
                                        <span className="flex items-center gap-1">
                                            <svg
                                                width="14"
                                                height="14"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="3"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            >
                                                <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
                                                <polyline points="17 6 23 6 23 12"></polyline>
                                            </svg>
                                            {metric.change}
                                        </span>
                                    ) : (
                                        <span>{metric.change}</span>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
