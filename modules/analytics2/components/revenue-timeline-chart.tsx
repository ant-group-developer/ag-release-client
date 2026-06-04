'use client';

import { Card, Empty, Radio, Skeleton } from 'antd';
import { useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';
import {
    Bar,
    BarChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';
import { formattedNumber } from '@/helpers/common';
import { useGetRevenueTimeline } from '../hooks/use-get-revenue-data';
import { DSP_PALETTE } from '../helpers/analytics-chart-helper';

interface Props {
    fromDate: string;
    toDate: string;
}

export default function RevenueTimelineChart({ fromDate, toDate }: Props) {
    const [viewMode, setViewMode] = useState<'revenue' | 'quantity'>('revenue');
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
                row[dsp] = viewMode === 'revenue' ? revenueUsd : quantity;
            });
            return row;
        });
    }, [items, viewMode]);

    // Build DSP to Color mapping
    const colorMap = useMemo(() => {
        const map: Record<string, string> = {};
        topDsps.forEach((dsp, i) => {
            map[dsp] = DSP_PALETTE[i % DSP_PALETTE.length];
        });
        map['Other'] = '#94a3b8';
        return map;
    }, [topDsps]);

    // Retrieve all active DSP keys present in series
    const allDspKeys = useMemo(() => {
        const keys = new Set<string>();
        items.forEach((item) =>
            item.series.forEach(({ dsp }) => keys.add(dsp))
        );
        return Array.from(keys);
    }, [items]);

    const barSize = Math.max(24, Math.min(56, Math.floor(400 / (barData.length || 1))));

    const formatValue = (v: any) => {
        if (viewMode === 'revenue') {
            return `$${Number(v).toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            })}`;
        }
        return formattedNumber(v, undefined as any, false);
    };

    const formatAxisValue = (v: any) => {
        if (viewMode === 'revenue') {
            return `$${formattedNumber(v, undefined as any, true)}`;
        }
        return formattedNumber(v, undefined as any, true);
    };

    return (
        <Card
            className="rounded-xl border-none shadow-sm"
            styles={{ body: { padding: '24px' } }}
        >
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <span className="text-base font-bold text-gray-800 dark:text-zinc-100">
                        {messages('analytics.revenue.timelineTitle', { defaultValue: 'Revenue Timeline' })}
                    </span>
                </div>
                <Radio.Group
                    value={viewMode}
                    onChange={(e) => setViewMode(e.target.value)}
                    buttonStyle="solid"
                >
                    <Radio.Button value="revenue" className="px-4 text-center">
                        {messages('analytics.revenue.modeRevenue', { defaultValue: 'Revenue (USD)' })}
                    </Radio.Button>
                    <Radio.Button value="quantity" className="px-4 text-center">
                        {messages('analytics.revenue.modeQuantity', { defaultValue: 'Plays (Quantity)' })}
                    </Radio.Button>
                </Radio.Group>
            </div>

            {isFetching ? (
                <Skeleton active paragraph={{ rows: 8 }} />
            ) : items.length === 0 ? (
                <Empty className="py-12" description={messages('common.noDataAvailable')} />
            ) : (
                <div className="w-full">
                    <div className="h-[400px] w-full">
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
                                    contentStyle={{
                                        borderRadius: '8px',
                                        border: 'none',
                                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                    }}
                                    formatter={(value: any, name: string) => [
                                        formatValue(value),
                                        name,
                                    ]}
                                />
                                {allDspKeys.map((dsp, i) => (
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
                                        backgroundColor: colorMap[dsp] ?? '#94a3b8',
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
