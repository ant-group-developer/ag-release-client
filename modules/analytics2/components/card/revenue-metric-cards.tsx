'use client';

import { theme } from 'antd';
import { DollarSign, Globe, Music } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { ANALYTICS_RELEASE_TYPE } from '../../enums';

import { formattedNumber } from '@/helpers/common';
import { useGetRevenueSummary } from '../../hooks/use-get-revenue-data';

interface Props {
    fromDate: string;
    toDate: string;
    releaseType?: ANALYTICS_RELEASE_TYPE;
}

export default function RevenueMetricCards({
    fromDate,
    toDate,
    releaseType,
}: Props) {
    const t = useTranslations();
    const { token } = theme.useToken();

    const { summaryData, isFetching: isLoading } = useGetRevenueSummary({
        fromDate,
        toDate,
        releaseType,
    });

    const metricsData = [
        {
            title: 'analytics.revenue.totalRevenue',
            value: summaryData?.totalRevenueUsd
                ? `$${formattedNumber(summaryData.totalRevenueUsd)}`
                : '$0.00',
            icon: DollarSign,
            colors: {
                color: 'text-emerald-600 dark:text-emerald-400',
                bgColor: 'bg-emerald-100/50 dark:bg-emerald-900/30',
            },
        },
        {
            title: 'analytics.revenue.totalPlays',
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
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
                            <div className="flex flex-col gap-1">
                                <span className="text-xs font-medium uppercase text-gray-400 dark:text-zinc-500">
                                    {t(metric.title)}
                                </span>
                                {isLoading ? (
                                    <div className="mt-1 h-7 w-20 animate-pulse rounded bg-gray-200 dark:bg-zinc-700" />
                                ) : (
                                    <span className="text-2xl font-bold">
                                        {metric.value}
                                    </span>
                                )}
                            </div>
                            <div
                                className={`rounded-xl p-3 ${themeColors.bgColor} ${themeColors.color}`}
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
