'use client';

import { formattedNumber } from '@/helpers/common';
import { Card, Radio } from 'antd';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import {
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';
import {
    BAR_CHART_DATA,
    DSP_CONFIG,
    PIE_CHART_DATA,
} from '../constants/mock-data';
import { renderCustomLabel } from './custom-label';
import PieLegend from './pie-legend';

export default function AnalyticsChart() {
    const [view, setView] = useState<'bar' | 'pie'>('bar');
    const messages = useTranslations();

    return (
        <Card
            className="rounded-xl border-none shadow-sm"
            styles={{ body: { padding: '24px' } }}
        >
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <span className="text-base font-bold text-gray-800 dark:text-zinc-100">
                        {messages('analytics.chart.title')}
                    </span>
                </div>
                <Radio.Group
                    value={view}
                    onChange={(e) => setView(e.target.value)}
                    buttonStyle="solid"
                >
                    <Radio.Button value="bar" className="w-16 text-center">
                        Bar
                    </Radio.Button>
                    <Radio.Button value="pie" className="w-16 text-center">
                        Pie
                    </Radio.Button>
                </Radio.Group>
            </div>
            {/* Bar Chart */}
            {view === 'bar' && (
                <div className="w-full">
                    <div className="h-[400px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={BAR_CHART_DATA}
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
                                    dataKey="month"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 12, fill: '#999' }}
                                    dy={10}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 12, fill: '#999' }}
                                    tickFormatter={(v) =>
                                        formattedNumber(
                                            v,
                                            undefined as any,
                                            true
                                        )
                                    }
                                />
                                <Tooltip
                                    contentStyle={{
                                        borderRadius: '8px',
                                        border: 'none',
                                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                    }}
                                    formatter={(value: any, name: string) => {
                                        const dsp = DSP_CONFIG.find(
                                            (d) => d.key === name
                                        );
                                        return [
                                            formattedNumber(
                                                value,
                                                undefined as any,
                                                true
                                            ),
                                            dsp?.label ?? name,
                                        ];
                                    }}
                                />
                                {DSP_CONFIG.map((dsp, i) => (
                                    <Bar
                                        key={dsp.key}
                                        dataKey={dsp.key}
                                        stackId="a"
                                        fill={dsp.color}
                                        barSize={36}
                                        radius={
                                            i === DSP_CONFIG.length - 1
                                                ? [4, 4, 0, 0]
                                                : [0, 0, 0, 0]
                                        }
                                    />
                                ))}
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="mt-4 flex flex-wrap items-center justify-center gap-4">
                        {DSP_CONFIG.map((dsp) => (
                            <div
                                key={dsp.key}
                                className="flex items-center gap-2"
                            >
                                <div
                                    className="h-3 w-3 rounded-sm"
                                    style={{ backgroundColor: dsp.color }}
                                />
                                <span className="text-sm text-gray-600 dark:text-zinc-400">
                                    {dsp.label}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Pie Chart */}
            {view === 'pie' && (
                <div className="flex h-[400px] w-full items-center">
                    {/* Pie */}
                    <div className="h-full flex-1">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={PIE_CHART_DATA}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={80}
                                    outerRadius={160}
                                    stroke="none"
                                    dataKey="value"
                                    labelLine={false}
                                    label={renderCustomLabel}
                                >
                                    {PIE_CHART_DATA.map((entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={entry.color}
                                        />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{
                                        borderRadius: '8px',
                                        border: 'none',
                                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                    }}
                                    formatter={(value: any) => [
                                        formattedNumber(
                                            value,
                                            undefined as any,
                                            true
                                        ),
                                        'Streams',
                                    ]}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    {/* Legend */}
                    <div className="w-56 flex-shrink-0">
                        <PieLegend />
                    </div>
                </div>
            )}
        </Card>
    );
}
