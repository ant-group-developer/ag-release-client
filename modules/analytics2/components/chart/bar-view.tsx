'use client';

import { CustomTooltip } from '@/components/shared/chart/chart-tooltip';
import { formattedNumber } from '@/helpers/common';
import { ReactElement, useMemo } from 'react';
import {
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';

interface BarViewProps {
    barData: any[];
    allDspKeys: string[];
    colorMap: Record<string, string>;
    chartHeight?: number;
    tooltipContent?: ReactElement;
    tooltipHeaders?: [string, string];
}

export default function BarView({
    barData,
    allDspKeys,
    colorMap,
    chartHeight = 400,
    tooltipContent,
    tooltipHeaders,
}: BarViewProps) {
    const barSize = Math.max(
        24,
        Math.min(56, Math.floor(400 / barData.length))
    );

    const stackedBarData = useMemo(() => {
        return barData.map((row) => {
            const sortedEntries = allDspKeys
                .map((dsp) => ({
                    dsp,
                    value: Number(row[dsp]) || 0,
                    color: colorMap[dsp] ?? '#94a3b8',
                    revenueUsd: Number(row[`${dsp}RevenueUsd`]) || 0,
                }))
                .sort((a, b) => {
                    const valueDiff = a.value - b.value;
                    return valueDiff || b.dsp.localeCompare(a.dsp);
                });

            return sortedEntries.reduce<Record<string, any>>(
                (acc, item, index) => {
                    const stackKey = `__stack_${index}`;

                    acc[stackKey] = item.value;
                    acc[`${stackKey}Name`] = item.dsp;
                    acc[`${stackKey}Color`] = item.color;
                    acc[`${stackKey}RevenueUsd`] = item.revenueUsd;

                    return acc;
                },
                { period: row.period }
            );
        });
    }, [allDspKeys, barData, colorMap]);

    const stackKeys = useMemo(() => {
        return allDspKeys.map((_, index) => `__stack_${index}`);
    }, [allDspKeys]);

    return (
        <div className="w-full">
            <div className="w-full" style={{ height: chartHeight }}>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={stackedBarData}
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
                                formattedNumber(v, undefined as any, true)
                            }
                        />
                        <Tooltip
                            content={
                                tooltipContent ?? (
                                    <CustomTooltip headers={tooltipHeaders} />
                                )
                            }
                            animationEasing="ease"
                        />
                        {stackKeys.map((stackKey, i) => (
                            <Bar
                                key={stackKey}
                                dataKey={stackKey}
                                stackId="a"
                                barSize={barSize}
                                radius={
                                    i === stackKeys.length - 1
                                        ? [4, 4, 0, 0]
                                        : [0, 0, 0, 0]
                                }
                            >
                                {stackedBarData.map((row, rowIndex) => (
                                    <Cell
                                        key={`${stackKey}-${rowIndex}`}
                                        fill={
                                            row[`${stackKey}Color`] ?? '#94a3b8'
                                        }
                                    />
                                ))}
                            </Bar>
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
    );
}
