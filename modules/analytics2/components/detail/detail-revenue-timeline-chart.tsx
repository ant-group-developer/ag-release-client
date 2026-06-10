'use client';

import { ThreeColumnTooltip } from '@/components/shared/chart/chart-tooltip';
import { formattedNumber } from '@/helpers/common';
import { Card, Empty, Skeleton } from 'antd';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';
import {
    Bar,
    BarChart,
    CartesianGrid,
    Tooltip as RechartsTooltip,
    ResponsiveContainer,
    XAxis,
    YAxis,
} from 'recharts';
import { DSP_PALETTE } from '../../helpers/analytics-chart-helper';

interface DetailRevenueTimelineChartProps {
    revenueTimelineData?: {
        topDsps: string[];
        items: {
            period: string;
            revenueUsd: number;
            quantity: number;
            series: {
                dsp: string;
                revenueUsd: number;
                quantity: number;
            }[];
        }[];
    };
    isRevenueFetching: boolean;
}

export default function DetailRevenueTimelineChart({
    revenueTimelineData,
    isRevenueFetching,
}: DetailRevenueTimelineChartProps) {
    const messages = useTranslations();

    const revenueTopDsps = revenueTimelineData?.topDsps ?? [];
    const revenueItems = revenueTimelineData?.items ?? [];

    const revenueBarData = useMemo(() => {
        return revenueItems.map((item) => {
            const row: Record<string, any> = { period: item.period };
            item.series.forEach(({ dsp, revenueUsd, quantity }) => {
                row[dsp] = revenueUsd;
                row[`${dsp}Quantity`] = quantity;
            });
            return row;
        });
    }, [revenueItems]);

    const revenueColorMap = useMemo(() => {
        const map: Record<string, string> = {};
        revenueTopDsps.forEach((dsp, i) => {
            map[dsp] = DSP_PALETTE[i % DSP_PALETTE.length];
        });
        map['Other'] = '#94a3b8';
        return map;
    }, [revenueTopDsps]);

    const revenueAllDspKeys = useMemo(() => {
        const keys = new Set<string>();
        const totals: Record<string, number> = {};

        revenueBarData.forEach((row) => {
            Object.entries(row).forEach(([key, value]) => {
                if (key === 'period' || key.endsWith('Quantity')) return;
                keys.add(key);
                totals[key] = (totals[key] ?? 0) + (Number(value) || 0);
            });
        });

        return Array.from(keys).sort((a, b) => {
            const totalDiff = (totals[b] ?? 0) - (totals[a] ?? 0);
            return totalDiff || a.localeCompare(b);
        });
    }, [revenueBarData]);

    return (
        <Card
            title={
                <span className="text-sm font-bold text-gray-800 dark:text-zinc-100">
                    {messages('analytics.revenue.timelineTitle')}
                </span>
            }
            className="rounded-xl border-none shadow-sm"
            styles={{ body: { padding: '24px' } }}
        >
            {isRevenueFetching ? (
                <Skeleton active paragraph={{ rows: 8 }} />
            ) : revenueItems.length === 0 ? (
                <Empty
                    className="py-12"
                    description={messages('common.noDataAvailable')}
                />
            ) : (
                <div className="w-full">
                    <div className="h-[400px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={revenueBarData}
                                margin={{
                                    top: 10,
                                    right: 30,
                                    left: 0,
                                    bottom: 0,
                                }}
                            >
                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    vertical={false}
                                    stroke="#f0f0f0"
                                />
                                <XAxis
                                    dataKey="period"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{
                                        fontSize: 12,
                                        fill: '#999',
                                    }}
                                    dy={10}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{
                                        fontSize: 12,
                                        fill: '#999',
                                    }}
                                    tickFormatter={(v) =>
                                        `$${formattedNumber(v, undefined as any, true)}`
                                    }
                                />
                                <RechartsTooltip
                                    content={
                                        <ThreeColumnTooltip
                                            headers={[
                                                messages(
                                                    'analytics.chart.dsp'
                                                ),
                                                messages(
                                                    'analytics.revenue.label'
                                                ),
                                                messages(
                                                    'analytics.chart.view'
                                                ),
                                            ]}
                                            primaryFormatter={(v) =>
                                                `$${Number(v).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                                            }
                                            extraColumn={{
                                                metaKey: 'Quantity',
                                                formatter: (val) =>
                                                    formattedNumber(
                                                        val as any,
                                                        undefined as any,
                                                        false
                                                    ),
                                            }}
                                        />
                                    }
                                    animationEasing="ease"
                                />
                                {[...revenueAllDspKeys]
                                    .reverse()
                                    .map((dsp, i) => (
                                        <Bar
                                            key={dsp}
                                            dataKey={dsp}
                                            stackId="a"
                                            fill={
                                                revenueColorMap[dsp] ??
                                                '#94a3b8'
                                            }
                                            barSize={Math.max(
                                                24,
                                                Math.min(
                                                    56,
                                                    Math.floor(
                                                        400 /
                                                            (revenueBarData.length ||
                                                                1)
                                                    )
                                                )
                                            )}
                                            radius={
                                                i ===
                                                revenueAllDspKeys.length - 1
                                                    ? [4, 4, 0, 0]
                                                    : [0, 0, 0, 0]
                                            }
                                        />
                                    ))}
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    {/* Legend Bar */}
                    <div className="mt-4 flex flex-wrap items-center justify-center gap-4">
                        {revenueAllDspKeys.map((dsp) => (
                            <div key={dsp} className="flex items-center gap-2">
                                <div
                                    className="h-3 w-3 rounded-sm"
                                    style={{
                                        backgroundColor:
                                            revenueColorMap[dsp] ?? '#94a3b8',
                                    }}
                                />
                                <span className="text-sm text-gray-600 dark:text-zinc-400">
                                    {dsp}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </Card>
    );
}
