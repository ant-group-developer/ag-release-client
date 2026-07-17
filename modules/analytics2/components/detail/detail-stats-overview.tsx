'use client';

import { getAvatarPlaceholder } from '@/helpers/common';
import { Avatar, theme, Typography } from 'antd';
import { Briefcase, DollarSign, ShoppingBag, TrendingUp } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface DetailStatsOverviewProps {
    trendViews?: number;
    salesViews?: number;
    revenueUsd?: number;
    isLoading: boolean;
    workspace?: {
        name: string;
        logo?: string | null;
    };
    isWorkspaceLoading?: boolean;
}

export default function DetailStatsOverview({
    trendViews = 0,
    salesViews = 0,
    revenueUsd = 0,
    isLoading,
    workspace,
    isWorkspaceLoading,
}: DetailStatsOverviewProps) {
    const messages = useTranslations();
    const { token } = theme.useToken();

    const overviewCount = [
        {
            label: messages('analytics.totalTrendViews'),
            count: trendViews.toLocaleString(),
            icon: TrendingUp,
            color: 'text-cyan-600 dark:text-cyan-400',
            bgColor: 'bg-cyan-100/50 dark:bg-cyan-900/30',
        },
        {
            label: messages('analytics.totalSalesViews'),
            count: salesViews.toLocaleString(),
            icon: ShoppingBag,
            color: 'text-purple-600 dark:text-purple-400',
            bgColor: 'bg-purple-100/50 dark:bg-purple-900/30',
        },
        {
            label: messages('analytics.totalRevenueUsd'),
            count: `$${revenueUsd.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            })}`,
            icon: DollarSign,
            color: 'text-emerald-600 dark:text-emerald-400',
            bgColor: 'bg-emerald-100/50 dark:bg-emerald-900/30',
        },
    ];

    const gridColsClass = workspace
        ? 'grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4'
        : 'grid grid-cols-1 gap-6 md:grid-cols-3';

    return (
        <div className={gridColsClass}>
            {overviewCount.map((item, index) => {
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
                                    {item.label}
                                </span>
                                {isLoading ? (
                                    <div className="mt-1 h-7 w-20 animate-pulse rounded bg-gray-200 dark:bg-zinc-700" />
                                ) : (
                                    <span className="text-2xl font-bold">
                                        {item.count}
                                    </span>
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
            {workspace && (
                <div
                    className="rounded-lg border border-gray-100 p-5 shadow-sm transition-all hover:shadow-md dark:border-zinc-800"
                    style={{ backgroundColor: token.colorBgContainer }}
                >
                    <div className="flex items-center justify-between">
                        <div className="flex flex-col gap-1 min-w-0 flex-1">
                            <span className="text-xs font-medium uppercase text-gray-400 dark:text-zinc-500">
                                {messages('tenant.label')}
                            </span>
                            {isWorkspaceLoading ? (
                                <div className="mt-1 h-7 w-28 animate-pulse rounded bg-gray-200 dark:bg-zinc-700" />
                            ) : (
                                <div className="flex items-center gap-2 mt-1 min-w-0">
                                    <Avatar
                                        src={workspace.logo ?? undefined}
                                        alt={workspace.name}
                                        size={32}
                                        shape="square"
                                        className="flex-shrink-0"
                                    >
                                        {getAvatarPlaceholder(workspace.name)}
                                    </Avatar>
                                    <Typography.Text
                                        strong
                                        className="text-base truncate"
                                    >
                                        {workspace.name}
                                    </Typography.Text>
                                </div>
                            )}
                        </div>
                        <div
                            className="rounded-xl p-3 bg-blue-100/50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex-shrink-0"
                        >
                            <Briefcase size={24} />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
