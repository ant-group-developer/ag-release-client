'use client';

import { formattedNumber } from '@/helpers/common';
import { Card, Radio } from 'antd';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
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
import { CHART_DATA } from '../constants/mock-data';

export default function AnalyticsChart() {
    const [view, setView] = useState('bar');
    const messages = useTranslations();

    return (
        <Card
            className="rounded-xl border-none shadow-sm"
            styles={{ body: { padding: '24px' } }}
        >
            <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                        <div className="h-0.5 w-4 bg-blue-500" />
                        <span className="text-sm">TikTok</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="h-4 w-4 rounded-sm bg-emerald-400" />
                        <span className="text-sm">Spotify</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="h-4 w-4 rounded-sm bg-rose-500" />
                        <span className="text-sm">Apple music</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="h-4 w-4 rounded-sm bg-amber-400" />
                        <span className="text-sm">Youtube</span>
                    </div>
                </div>
                <Radio.Group
                    value={view}
                    onChange={(e) => setView(e.target.value)}
                    buttonStyle="solid"
                >
                    <Radio.Button value="bar" className="w-16 text-center">
                        Bar
                    </Radio.Button>
                    <Radio.Button value="line" className="w-16 text-center">
                        Line
                    </Radio.Button>
                </Radio.Group>
            </div>

            <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart
                        data={CHART_DATA}
                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                        <CartesianGrid
                            strokeDasharray="3 3"
                            vertical={false}
                            stroke="#f0f0f0"
                        />
                        <XAxis
                            dataKey="date"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 12, fill: '#999' }}
                            dy={10}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 12, fill: '#999' }}
                            orientation="left"
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
                        />
                        <Bar
                            dataKey="youtube"
                            stackId="a"
                            fill="#FFC107"
                            radius={[2, 2, 0, 0]}
                            barSize={32}
                            hide={view === 'line'}
                        />
                        <Bar
                            dataKey="apple"
                            stackId="a"
                            fill="#F44336"
                            radius={[2, 2, 0, 0]}
                            barSize={32}
                            hide={view === 'line'}
                        />
                        <Bar
                            dataKey="spotify"
                            stackId="a"
                            fill="#4ADE80"
                            radius={[2, 2, 0, 0]}
                            barSize={32}
                            hide={view === 'line'}
                        />
                        <Line
                            type="monotone"
                            dataKey="line"
                            stroke="#3B82F6"
                            strokeWidth={2}
                            dot={false}
                        />
                    </ComposedChart>
                </ResponsiveContainer>
            </div>
        </Card>
    );
}
