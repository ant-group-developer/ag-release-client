'use client';

import { Space, theme } from 'antd';
import { DollarSign, Music, Globe } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useGetRevenueSummary } from '../hooks/use-get-revenue-data';

interface Props {
    fromDate: string;
    toDate: string;
}

export default function RevenueMetricCards({ fromDate, toDate }: Props) {
    const t = useTranslations();
    const { token } = theme.useToken();

    const { summaryData, isFetching: isLoading } = useGetRevenueSummary({
        fromDate,
        toDate,
    });

    const metricsData = [
        {
            title: 'analytics.revenue.totalRevenue',
            defaultTitle: 'Total Revenue',
            value: summaryData?.totalRevenueUsd
                ? `$${summaryData.totalRevenueUsd.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                  })}`
                : '$0.00',
            icon: DollarSign,
            colors: {
                color: 'text-emerald-600 dark:text-emerald-400',
                bgColor: 'bg-emerald-100/50 dark:bg-emerald-900/30',
            },
        },
        {
            title: 'analytics.revenue.totalPlays',
            defaultTitle: 'Total Plays',
            value: summaryData?.totalQuantity
                ? summaryData.totalQuantity.toLocaleString()
                : '0',
            icon: Music,
            colors: {
                color: 'text-blue-600 dark:text-blue-400',
                bgColor: 'bg-blue-100/50 dark:bg-blue-900/30',
            },
        },
        {
            title: 'analytics.revenue.totalTerritories',
            defaultTitle: 'Territories',
            value: summaryData?.totalTerritories
                ? summaryData.totalTerritories.toLocaleString()
                : '0',
            icon: Globe,
            colors: {
                color: 'text-purple-600 dark:text-purple-400',
                bgColor: 'bg-purple-100/50 dark:bg-purple-900/30',
            },
        },
    ] as const;

    return (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {metricsData.map((metric, index) => {
                const Icon = metric.icon;
                const themeColors = metric.colors;

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
                                        {t(metric.title, { defaultValue: metric.defaultTitle })}
                                    </span>
                                    {isLoading ? (
                                        <div className="mt-1.5 h-6 w-32 animate-pulse rounded bg-gray-200 dark:bg-zinc-700" />
                                    ) : (
                                        <span className="text-xl font-bold text-gray-900 dark:text-zinc-100">
                                            {metric.value}
                                        </span>
                                    )}
                                </div>
                            </Space>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
