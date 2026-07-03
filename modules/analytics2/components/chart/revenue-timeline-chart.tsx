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
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';
import { DSP_PALETTE } from '../../helpers/analytics-chart-helper';
import { useGetRevenueTimeline } from '../../hooks/use-get-revenue-data';

interface Props {
    fromDate: string;
    toDate: string;
    chartHeight?: number;
}

export default function RevenueTimelineChart({
    fromDate,
    toDate,
    chartHeight = 400,
}: Props) {
    const messages = useTranslations();

    // Fetch Revenue Timeline Data
    const { timelineData, isFetching } = useGetRevenueTimeline({
        fromDate,
        toDate,
        topN: 5,
        includeOther: true,
    });

    const topDsps = timelineData?.topDsps ?? [];
    const items = timelineData?.items ?? [];

    // Transform raw timeline items to Recharts compatible bar data
    const barData = useMemo(() => {
        return items.map((item) => {
            const row: Record<string, any> = { period: item.period };
            item.series.forEach(({ dsp, revenueUsd, quantity }) => {
                row[dsp] = revenueUsd;
                row[`${dsp}Quantity`] = quantity;
            });
            return row;
        });
    }, [items]);

    // Build DSP to Color mapping
    const colorMap = useMemo(() => {
        const map: Record<string, string> = {};
        topDsps.forEach((dsp, i) => {
            map[dsp] = DSP_PALETTE[i % DSP_PALETTE.length];
        });
        map['Other'] = '#94a3b8';
        return map;
    }, [topDsps]);

    // Retrieve all active DSP keys present in series, sorted by total value descending
    const allDspKeys = useMemo(() => {
        const keys = new Set<string>();
        const totals: Record<string, number> = {};

        barData.forEach((row) => {
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
    }, [barData]);

    const barSize = Math.max(
        24,
        Math.min(56, Math.floor(400 / (barData.length || 1)))
    );

    const formatValue = (v: any) => {
        return `$${formattedNumber(Number(v))}`;



    };

    const formatAxisValue = (v: any) => {
        return `$${formattedNumber(v, undefined as any, true)}`;
    };

    return (
        <Card
            className="rounded-xl border-none shadow-sm"
            styles={{ body: { padding: '24px' } }}
        >
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <span className="text-md font-bold text-gray-800 dark:text-zinc-100">
                    {messages('analytics.revenue.timelineTitle')}
                </span>
            </div>

            {isFetching ? (
                <Skeleton active paragraph={{ rows: 8 }} />
            ) : items.length === 0 ? (
                <Empty
                    className="py-12"
                    description={messages('common.noDataAvailable')}
                />
            ) : (
                <div className="w-full">
                    <div className="w-full" style={{ height: chartHeight }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={barData}
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
                                    tickFormatter={formatAxisValue}
                                />
                                <Tooltip
                                    content={
                                        <ThreeColumnTooltip
                                            headers={[
                                                messages('analytics.chart.dsp'),
                                                messages(
                                                    'analytics.revenue.label'
                                                ),
                                                messages(
                                                    'analytics.chart.view'
                                                ),
                                            ]}
                                            primaryFormatter={formatValue}
                                            showTotal
                                            totalLabel={messages(
                                                'common.total'
                                            )}
                                            extraColumn={{
                                                metaKey: 'Quantity',
                                                formatter: (value) =>
                                                    formattedNumber(
                                                        value as any,
                                                        undefined as any,
                                                        false
                                                    ),
                                            }}
                                        />
                                    }
                                    animationEasing="ease"
                                />
                                {[...allDspKeys].reverse().map((dsp, i) => (
                                    <Bar
                                        key={dsp}
                                        dataKey={dsp}
                                        stackId="a"
                                        fill={colorMap[dsp] ?? '#94a3b8'}
                                        barSize={barSize}
                                        radius={
                                            i === allDspKeys.length - 1
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
                        {allDspKeys.map((dsp) => (
                            <div key={dsp} className="flex items-center gap-2">
                                <div
                                    className="h-3 w-3 rounded-sm"
                                    style={{
                                        backgroundColor:
                                            colorMap[dsp] ?? '#94a3b8',
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
