'use client';

import { formattedNumber } from '@/helpers/common';
import { Card, Select, theme } from 'antd';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import {
    Bar,
    BarChart,
    CartesianGrid,
    LabelList,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';

type Props = {
    color?: string;
    className?: string;
};

export default function StreamChart({ color, className }: Props) {
    const messages = useTranslations();
    const { token } = theme.useToken();
    const [year, setYear] = useState('2026');

    // 🔹 Fake data: các DSP phổ biến
    const data = [
        { name: 'Spotify', value: 520 },
        { name: 'Apple Music', value: 310 },
        { name: 'YouTube Music', value: 460 },
        { name: 'Amazon Music', value: 220 },
        { name: 'Deezer', value: 150 },
        { name: 'Tidal', value: 120 },
        { name: 'SoundCloud', value: 80 },
        { name: 'Tencent Music', value: 270 },
        { name: 'NetEase', value: 190 },
        { name: 'Anghami', value: 60 },
    ];

    return (
        <Card className="h-full" styles={{ body: { padding: '24px' } }}>
            <div className="mb-8 flex items-start justify-between">
                <div>
                    <h3 className="mb-1 text-lg font-bold">
                        {messages('dashboard.stream_by_dsp')}
                    </h3>
                    <p className="text-sm text-gray-400">
                        {messages('dashboard.stream_distribution_subtitle', {
                            year,
                        })}
                    </p>
                </div>
                <Select
                    defaultValue={year}
                    onChange={(val) => setYear(val)}
                    options={[
                        { value: '2026', label: '2026' },
                        { value: '2025', label: '2025' },
                        { value: '2024', label: '2024' },
                    ]}
                    className="w-[100px]"
                />
            </div>

            <div className={`h-[350px] ${className}`}>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={data}
                        margin={{ top: 20, right: 0, left: -20, bottom: 0 }}
                        barSize={40}
                    >
                        <CartesianGrid
                            strokeDasharray="3 3"
                            vertical={false}
                            stroke={token.colorBorderSecondary}
                        />
                        <XAxis
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            tick={{
                                fontSize: 12,
                                fill: token.colorTextSecondary,
                            }}
                            dy={10}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{
                                fontSize: 12,
                                fill: token.colorTextSecondary,
                            }}
                            tickFormatter={(val) => formattedNumber(val)}
                        />
                        <Tooltip
                            cursor={{ fill: 'transparent' }}
                            content={({ active, payload }) => {
                                if (active && payload && payload.length) {
                                    const { name, value } = payload[0].payload;
                                    return (
                                        <div
                                            className="rounded-lg border-none px-3 py-2 shadow-xl"
                                            style={{
                                                backgroundColor:
                                                    'rgba(255, 255, 255, 0.95)',
                                            }}
                                        >
                                            <p className="text-sm font-bold text-gray-800">
                                                {name}
                                            </p>
                                            <p className="text-xs font-semibold text-blue-600">
                                                Streams:{' '}
                                                {formattedNumber(value)}
                                            </p>
                                        </div>
                                    );
                                }
                                return null;
                            }}
                        />
                        <Bar
                            dataKey="value"
                            fill={color || '#4F73F5'}
                            radius={[8, 8, 0, 0]}
                        >
                            <LabelList
                                dataKey="value"
                                position="top"
                                offset={10}
                                style={{
                                    fontSize: 12,
                                    fontWeight: 500,
                                    fill: token.colorTextSecondary,
                                }}
                                formatter={(val: any) => formattedNumber(val)}
                            />
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </Card>
    );
}
