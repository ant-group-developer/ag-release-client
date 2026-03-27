import { ScrollArea } from '@/components/ui/scroll/scroll-area';
import { formattedNumber } from '@/helpers/common';
import { theme } from 'antd';
import { Building2, DiscAlbum, Music, Users } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Area, AreaChart, ResponsiveContainer } from 'recharts';
import { IssueCountData, OverviewCountData } from '../../types';

type Props = {
    issuesData: IssueCountData[];
    isIssuesLoading: boolean;
    overviewData: OverviewCountData;
    isOverviewLoading: boolean;
};

const fakeIssues: IssueCountData[] = [
    { id: '1', nameEn: 'Copyright Claims', total: 32 },
    { id: '2', nameEn: 'Metadata Fixes', total: 12 },
    { id: '3', nameEn: 'Audio Quality', total: 33 },
    { id: '4', nameEn: 'Artwork Issues', total: 12 },
];

const MiniChart = ({
    data,
    color,
    index,
}: {
    data: number[];
    color: string;
    index: number;
}) => {
    if (!data || data.length === 0) return null;

    const chartData = data.map((val) => ({ value: val }));
    const gradientId = `colorArea-${index}`;

    return (
        <div className="-mr-2 h-10 w-20">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                    <defs>
                        <linearGradient
                            id={gradientId}
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                        >
                            <stop
                                offset="5%"
                                stopColor={color}
                                stopOpacity={0.3}
                            />
                            <stop
                                offset="95%"
                                stopColor={color}
                                stopOpacity={0}
                            />
                        </linearGradient>
                    </defs>
                    <Area
                        type="linear"
                        dataKey="value"
                        stroke={color}
                        strokeWidth={2}
                        fillOpacity={1}
                        fill={`url(#${gradientId})`}
                        isAnimationActive={false}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
};

export default function StatsOverview({
    issuesData,
    isIssuesLoading,
    overviewData,
    isOverviewLoading,
}: Props) {
    const messages = useTranslations();
    const { token } = theme.useToken();

    const overviewCount = [
        {
            label: messages('release.label'),
            count: overviewData?.releasesCount,
            icon: DiscAlbum,
            color: 'text-purple-600 dark:text-purple-400',
            bgColor: 'bg-purple-100/50 dark:bg-purple-900/30',
            trend: '+12%',
            trendColor: 'text-cyan-500',
            chartData: [20, 30, 25, 35, 50],
            chartColor: '#a855f7', // purple-500
        },
        {
            label: messages('track.label'),
            count: overviewData?.tracksCount,
            icon: Music,
            color: 'text-cyan-600 dark:text-cyan-400',
            bgColor: 'bg-cyan-100/50 dark:bg-cyan-900/30',
            trend: '+5.4%',
            trendColor: 'text-cyan-500',
            chartData: [25, 40, 30, 45, 60],
            chartColor: '#22d3ee', // cyan-400
        },
        {
            label: messages('label.label'),
            count: overviewData?.labelsCount,
            icon: Building2,
            color: 'text-pink-600 dark:text-pink-400',
            bgColor: 'bg-pink-100/50 dark:bg-pink-900/30',
            trend: 'Stable',
            trendColor: 'text-gray-400',
            chartData: [40, 40, 40, 40, 40],
            chartColor: '#db2777', // pink-600
        },
        {
            label: messages('artist.label'),
            count: overviewData?.artistsCount,
            icon: Users,
            color: 'text-indigo-600 dark:text-indigo-400',
            bgColor: 'bg-indigo-100/50 dark:bg-indigo-900/30',
            trend: '+3',
            trendColor: 'text-cyan-500',
            chartData: [30, 40, 35, 45, 55],
            chartColor: '#6366f1', // indigo-500
        },
    ];

    const displayIssues = (
        issuesData?.length > 0 ? issuesData : fakeIssues
    ).slice(0, 4);

    return (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
            {overviewCount?.map((item, index) => {
                const Icon = item.icon;
                return (
                    <div
                        key={index}
                        className="rounded-2xl border border-gray-100 p-5 shadow-sm transition-all hover:shadow-md dark:border-zinc-800"
                        style={{ backgroundColor: token.colorBgContainer }}
                    >
                        <div className="mb-4 flex items-center justify-between">
                            <div
                                className={`rounded-xl p-2.5 ${item.bgColor} ${item.color}`}
                            >
                                <Icon size={18} />
                            </div>
                            <div
                                className={`text-[10px] font-semibold ${item.trendColor}`}
                            >
                                {item.trend.includes('+') ? (
                                    <span className="flex items-center gap-1">
                                        <svg
                                            width="10"
                                            height="10"
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
                                        {item.trend}
                                    </span>
                                ) : (
                                    <span>{item.trend}</span>
                                )}
                            </div>
                        </div>

                        <div className="mb-1 text-[10px] font-bold uppercase tracking-[0.1em] text-gray-400 dark:text-zinc-500">
                            {item?.label}
                        </div>

                        <div className="flex items-end justify-between">
                            <div className="text-xl font-bold text-gray-900 dark:text-white">
                                {formattedNumber(item?.count)}
                            </div>
                            <MiniChart
                                data={item.chartData}
                                color={item.chartColor}
                                index={index}
                            />
                        </div>
                    </div>
                );
            })}

            {/* 5th Box: Issues */}
            <div
                className="rounded-2xl border border-gray-100 p-5 shadow-sm transition-all hover:shadow-md dark:border-zinc-800"
                style={{ backgroundColor: token.colorBgContainer }}
            >
                <div className="mb-2 flex items-center justify-between">
                    <div className="text-[10px] font-bold uppercase tracking-[0.1em] text-gray-400 dark:text-zinc-500">
                        {messages('common.issues')}
                    </div>
                </div>

                <ScrollArea className="h-24 pr-2">
                    <div className="space-y-2.5">
                        {displayIssues.map((issue, idx) => (
                            <div
                                key={issue.id || idx}
                                className="flex items-center justify-between transition-colors hover:bg-gray-50/50 dark:hover:bg-zinc-800/50"
                            >
                                <span className="truncate text-[11px] font-medium text-gray-500 dark:text-zinc-400">
                                    {issue.nameEn}
                                </span>
                                <span className="text-[11px] font-bold text-gray-900 dark:text-white">
                                    {formattedNumber(issue.total)}
                                </span>
                            </div>
                        ))}
                    </div>
                </ScrollArea>
            </div>
        </div>
    );
}
