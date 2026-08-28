'use client';

import { DATE_FORMAT } from '@/enums/common';
import { formattedDate, formattedNumber } from '@/helpers/common';
import { cn } from '@/helpers/tailwind';
import { Card, Empty, Skeleton } from 'antd';
import { useTranslations } from 'next-intl';
import {
    Bar,
    BarChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';

interface OverviewBarChartViewProps {
    title: React.ReactNode;
    data: any[];
    xAxisKey: string;
    barKey: string;
    barName: string;
    barColor?: string;
    chartHeight?: number;
    loading?: boolean;
    valuePrefix?: string;
    className?: string;
}

const CustomBarTooltip = ({
    active,
    payload,
    label,
    barName,
    valuePrefix = '',
}: any) => {
    if (active && payload && payload.length) {
        const firstEntry = payload[0];

        return (
            <div className="flex flex-col gap-1 rounded-lg border border-[#f0f0f0] bg-white px-3.5 py-2.5 shadow-[0_4px_12px_rgba(0,0,0,0.1)] dark:border-zinc-700 dark:bg-zinc-800">
                <span className="text-[13px] font-semibold text-gray-900 dark:text-zinc-100">
                    {label}
                </span>
                <div className="flex items-center gap-2">
                    <div
                        className="h-2 w-2 rounded-full"
                        style={{
                            backgroundColor:
                                firstEntry.color ||
                                firstEntry.fill ||
                                '#1890ff',
                        }}
                    />
                    <span className="text-xs text-gray-600 dark:text-zinc-400">
                        {firstEntry.name || barName}:
                    </span>
                    <span className="ml-1 text-xs font-semibold text-gray-900 dark:text-zinc-100">
                        {valuePrefix}
                        {formattedNumber(firstEntry.value)}
                    </span>
                </div>
            </div>
        );
    }
    return null;
};

export default function OverviewBarChartView({
    title,
    data,
    xAxisKey,
    barKey,
    barName,
    barColor = '#1890ff',
    chartHeight = 400,
    loading = false,
    valuePrefix = '',
    className = '',
}: OverviewBarChartViewProps) {
    const messages = useTranslations();

    const barSize = Math.max(
        16,
        Math.min(40, Math.floor(300 / (data.length || 1)))
    );

    return (
        <Card
            className={cn('h-full rounded-xl border-none shadow-sm', className)}
            styles={{
                body: {
                    padding: '24px',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                },
            }}
        >
            <div className="mb-6 flex w-full flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                {typeof title === 'string' ? (
                    <span className="text-base font-bold">{title}</span>
                ) : (
                    title
                )}
            </div>

            {loading ? (
                <Skeleton active paragraph={{ rows: 6 }} />
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
                        height: chartHeight,
                    }}
                >
                    <div className="w-full" style={{ flex: 1, minHeight: 0 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={data}
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
                                    dataKey={xAxisKey}
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{
                                        fontSize: 12,
                                        fill: '#999',
                                    }}
                                    dy={10}
                                    minTickGap={30}
                                    tickFormatter={(value) =>
                                        formattedDate(
                                            value,
                                            DATE_FORMAT.DATE_ONLY_DASH
                                        )
                                    }
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
                                        <CustomBarTooltip
                                            barName={barName}
                                            valuePrefix={valuePrefix}
                                        />
                                    }
                                    animationEasing="ease"
                                />
                                <Bar
                                    dataKey={barKey}
                                    name={barName}
                                    fill={barColor}
                                    radius={[4, 4, 0, 0]}
                                    barSize={barSize}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            )}
        </Card>
    );
}
