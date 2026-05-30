'use client';

import { formattedNumber } from '@/helpers/common';
import { Card, Empty, Select, Skeleton } from 'antd';
import { useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';
import {
    Bar,
    CartesianGrid,
    ComposedChart,
    Line,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';
import { DAY_OPTIONS, DayOptionValue } from '../constants/types';
import { DSP_PALETTE, getDateRange } from '../helpers/analytics-chart-helpertrend-view';
import { useGetTrendViewDaily } from '../hooks/use-get-dsp-timeline';
import { ChartTooltip } from './chart-tooltip';

export default function TrendViewDaily() {
    const [days, setDays] = useState<DayOptionValue>(30);
    const messages = useTranslations();

    const selectOptions = useMemo(
        () =>
            DAY_OPTIONS.map((opt) => ({
                label: messages(opt.messageKey as any),
                value: opt.value,
            })),
        [messages]
    );

    const { fromDate, toDate } = useMemo(() => getDateRange(days), [days]);

    const { trendTimelineData, isFetching } = useGetTrendViewDaily({
        fromDate,
        toDate,
        topN: 5,
        includeOther: true,
    });

    const topDsps = useMemo(
        () => trendTimelineData?.topDsps ?? [],
        [trendTimelineData?.topDsps]
    );

    const items = useMemo(
        () => trendTimelineData?.items ?? [],
        [trendTimelineData?.items]
    );

    const colorMap = useMemo(() => {
        const map: Record<string, string> = {};
        topDsps.forEach((dsp, i) => {
            map[dsp] = DSP_PALETTE[i % DSP_PALETTE.length];
        });
        map['Other'] = '#94a3b8';
        return map;
    }, [topDsps]);

    const barData = useMemo(() => {
        return items.map((item) => {
            const row: Record<string, any> = {
                period: item.period.slice(5), // MM-DD
            };
            let total = 0;
            item.series.forEach(({ dsp, trendViews }) => {
                row[dsp] = trendViews;
                total += trendViews;
            });
            row['total'] = total;
            return row;
        });
    }, [items]);

    const allDspKeys = useMemo(() => {
        const keys = new Set<string>();
        items.forEach((item) =>
            item.series.forEach(({ dsp }) => keys.add(dsp))
        );
        return Array.from(keys);
    }, [items]);

    const barSize = Math.max(18, Math.min(48, Math.floor(600 / Math.max(barData.length, 1))));
    const totalLabel = messages('analytics.chart.total');

    return (
        <Card
            className="rounded-xl border-none shadow-sm"
            styles={{ body: { padding: '24px' } }}
        >
            <div className="mb-6 flex items-center justify-between">
                <span className="text-base font-bold text-gray-800 dark:text-zinc-100">
                    {messages('analytics.chart.trendViewDaily')}
                </span>
                <Select
                    value={days}
                    onChange={(val) => setDays(val)}
                    options={selectOptions}
                    className="w-44"
                />
            </div>

            {isFetching ? (
                <Skeleton active paragraph={{ rows: 8 }} />
            ) : items.length === 0 ? (
                <Empty
                    className="py-12"
                    description={messages('common.noDataAvailable')}
                />
            ) : (
                <>
                    <div className="h-[400px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <ComposedChart
                                data={barData}
                                margin={{ top: 16, right: 30, left: 0, bottom: 0 }}
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
                                    tick={{ fontSize: 11, fill: '#999' }}
                                    dy={10}
                                    interval="preserveStartEnd"
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 11, fill: '#999' }}
                                    tickFormatter={(v) =>
                                        formattedNumber(v, undefined as any, true)
                                    }
                                />
                                <Tooltip
                                    content={<ChartTooltip totalLabel={totalLabel} />}
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

                                <Line
                                    type="monotone"
                                    dataKey="total"
                                    stroke="#6366f1"
                                    strokeWidth={2}
                                    dot={false}
                                    activeDot={false}
                                />
                            </ComposedChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="mt-4 flex flex-wrap items-center justify-center gap-4">
                        {allDspKeys.map((dsp) => (
                            <div key={dsp} className="flex items-center gap-2">
                                <div
                                    className="h-3 w-3 rounded-sm"
                                    style={{ backgroundColor: colorMap[dsp] ?? '#94a3b8' }}
                                />
                                <span className="text-sm text-gray-600 dark:text-zinc-400">
                                    {dsp}
                                </span>
                            </div>
                        ))}
                        <div className="flex items-center gap-2">
                            <div className="h-0.5 w-6 rounded-full bg-indigo-500" />
                            <span className="text-sm text-gray-600 dark:text-zinc-400">
                                {totalLabel}
                            </span>
                        </div>
                    </div>
                </>
            )}
        </Card>
    );
}
