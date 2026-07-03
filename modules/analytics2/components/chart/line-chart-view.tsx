'use client';

import { formattedNumber } from '@/helpers/common';
import { Card, Empty, Skeleton, Typography } from 'antd';
import { useTranslations } from 'next-intl';
import {
    Area,
    AreaChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';

export interface TooltipKeyConfig {
    key: string;
    name: string;
    valuePrefix?: string;
}

const DEFAULT_MIN_TICK_GAP = 15;

interface LineChartViewProps {
    title: React.ReactNode;
    data: any[];
    xAxisKey: string;
    lineKey: string;
    lineName: string;
    strokeColor?: string;
    chartHeight?: number;
    loading?: boolean;
    valuePrefix?: string;
    additionalTooltipKeys?: TooltipKeyConfig[];
    minTickGap?: number;
}

const CustomLineTooltip = ({
    active,
    payload,
    label,
    lineName,
    valuePrefix = '',
    additionalTooltipKeys = [],
    any,
}: any) => {
    if (active && payload && payload.length) {
        const firstEntry = payload[0];
        const originalData = firstEntry.payload;

        return (
            <div className="flex flex-col gap-1 rounded-lg border border-[#f0f0f0] bg-white px-3.5 py-2.5 shadow-[0_4px_12px_rgba(0,0,0,0.1)] dark:border-zinc-700 dark:bg-zinc-800">
                <span className="text-[13px] font-semibold text-gray-900 dark:text-zinc-100">
                    {label}
                </span>

                {/* Main line item */}
                <div className="flex items-center gap-2">
                    <div
                        className="h-2 w-2 rounded-full"
                        style={{
                            backgroundColor:
                                firstEntry.color ||
                                firstEntry.stroke ||
                                '#1890ff',
                        }}
                    />
                    <span className="text-xs text-gray-600 dark:text-zinc-400">
                        {firstEntry.name || lineName}:
                    </span>
                    <span className="ml-1 text-xs font-semibold text-gray-900 dark:text-zinc-100">
                        {valuePrefix}
                        {formattedNumber(firstEntry.value)}
                    </span>
                </div>

                {/* Additional metrics */}
                {additionalTooltipKeys.map(
                    (cfg: TooltipKeyConfig, idx: number) => {
                        const val = originalData?.[cfg.key];
                        if (val === undefined || val === null) return null;
                        return (
                            <div key={idx} className="flex items-center gap-2">
                                <div className="h-2 w-2 rounded-full bg-gray-400 dark:bg-zinc-500" />
                                <span className="text-xs text-gray-600 dark:text-zinc-400">
                                    {cfg.name}:
                                </span>
                                <span className="ml-1 text-xs font-semibold text-gray-900 dark:text-zinc-100">
                                    {cfg.valuePrefix || ''}
                                    {formattedNumber(val)}
                                </span>
                            </div>
                        );
                    }
                )}
            </div>
        );
    }
    return null;
};

export default function LineChartView({
    title,
    data,
    xAxisKey,
    lineKey,
    lineName,
    strokeColor = '#1890ff',
    chartHeight = 400,
    loading = false,
    valuePrefix = '',
    additionalTooltipKeys = [],
    minTickGap = DEFAULT_MIN_TICK_GAP,
}: LineChartViewProps) {
    const messages = useTranslations();

    return (
        <Card
            className="h-full rounded-xl border-none shadow-sm"
            styles={{
                body: {
                    padding: '24px',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                },
            }}
        >
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between w-full">
                {typeof title === 'string' ? (
                    <span className="text-base font-bold">{title}</span>
                ) : (
                    title
                )}
            </div>

            {loading ? (
                <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
                    <Skeleton active paragraph={{ rows: 8 }} />
                </div>
            ) : data.length === 0 ? (
                <div
                    style={{
                        flex: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <Empty
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                        className="py-12"
                        description={messages('common.noDataAvailable')}
                    />
                </div>
            ) : (
                <div
                    className="w-full"
                    style={{
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        minHeight: chartHeight,
                    }}
                >
                    <div className="w-full" style={{ flex: 1, minHeight: 0 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart
                                data={data}
                                margin={{
                                    top: 10,
                                    right: 30,
                                    left: 0,
                                    bottom: 0,
                                }}
                            >
                                <defs>
                                    <linearGradient
                                        id="colorViews"
                                        x1="0"
                                        y1="0"
                                        x2="0"
                                        y2="1"
                                    >
                                        <stop
                                            offset="5%"
                                            stopColor={strokeColor}
                                            stopOpacity={0.2}
                                        />
                                        <stop
                                            offset="95%"
                                            stopColor={strokeColor}
                                            stopOpacity={0.01}
                                        />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    vertical={false}
                                    stroke="#f0f0f0"
                                />
                                <XAxis
                                    dataKey={xAxisKey}
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{
                                        fontSize: 12,
                                        fill: '#999',
                                    }}
                                    dy={10}
                                    minTickGap={minTickGap}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{
                                        fontSize: 12,
                                        fill: '#999',
                                    }}
                                    tickFormatter={(v) =>
                                        `${valuePrefix}${formattedNumber(
                                            v,
                                            undefined as any,
                                            true
                                        )}`
                                    }
                                />
                                <Tooltip
                                    content={
                                        <CustomLineTooltip
                                            lineName={lineName}
                                            valuePrefix={valuePrefix}
                                            additionalTooltipKeys={
                                                additionalTooltipKeys
                                            }
                                        />
                                    }
                                    animationEasing="ease"
                                />
                                <Area
                                    type="monotone"
                                    dataKey={lineKey}
                                    name={lineName}
                                    stroke={strokeColor}
                                    strokeWidth={2}
                                    fillOpacity={1}
                                    fill="url(#colorViews)"
                                    dot={{
                                        r: 4,
                                        fill: strokeColor,
                                        stroke: strokeColor,
                                    }}
                                    activeDot={{
                                        r: 6,
                                        fill: strokeColor,
                                        stroke: strokeColor,
                                    }}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            )}
        </Card>
    );
}
