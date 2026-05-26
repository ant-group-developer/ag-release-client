'use client';

import { formattedNumber } from '@/helpers/common';
import {
    Bar,
    BarChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';

interface BarViewProps {
    barData: any[];
    allDspKeys: string[];
    colorMap: Record<string, string>;
}

export default function BarView({
    barData,
    allDspKeys,
    colorMap,
}: BarViewProps) {
    const barSize = Math.max(24, Math.min(56, Math.floor(400 / barData.length)));

    return (
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
                            tickFormatter={(v) =>
                                formattedNumber(v, undefined as any, true)
                            }
                        />
                        <Tooltip
                            contentStyle={{
                                borderRadius: '8px',
                                border: 'none',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                            }}
                            formatter={(value: any, name: string) => [
                                formattedNumber(value, undefined as any, true),
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
    );
}
