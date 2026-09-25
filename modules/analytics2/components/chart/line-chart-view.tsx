'use client';

import { DATE_FORMAT } from '@/enums/common';
import { formattedDate, formattedNumber } from '@/helpers/common';
import { cn } from '@/helpers/tailwind';
import { Card, Empty, Typography } from 'antd';
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

export interface LineChartLineConfig {
    key: string;
    name: string;
    color: string;
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
    className?: string;
    lines?: LineChartLineConfig[];
}

const CustomLineTooltip = ({
    active,
    payload,
    label,
    lineName,
    valuePrefix = '',
    additionalTooltipKeys = [],
    lines = [],
}: any) => {
    const messages = useTranslations();

    if (active && payload && payload.length) {
        const firstEntry = payload[0];
        const originalData = firstEntry.payload;
        const tooltipEntries = lines.length ? payload : [firstEntry];

        const sortedEntries = [...tooltipEntries].sort(
            (a: any, b: any) =>
                (Number(b?.value) || 0) - (Number(a?.value) || 0)
        );

        const totalValue = sortedEntries.reduce(
            (sum: number, entry: any) => sum + (Number(entry?.value) || 0),
            0
        );

        const showTotal = Boolean(lines?.length) || sortedEntries.length > 1;

        return (
            <div className="flex max-w-[360px] flex-col gap-1.5 rounded-lg border border-[#f0f0f0] bg-white px-3.5 py-2.5 shadow-[0_4px_12px_rgba(0,0,0,0.1)] dark:border-zinc-700 dark:bg-zinc-800">
                <Typography.Text strong className="text-[13px]">
                    {label}
                </Typography.Text>

                {showTotal && (
                    <div className="flex items-center justify-between gap-3 border-b border-[#f0f0f0] pb-1.5 text-xs dark:border-zinc-700">
                        <Typography.Text strong className="text-xs">
                            {messages('common.total')}:
                        </Typography.Text>
                        <Typography.Text
                            strong
                            className="shrink-0 text-right text-xs tabular-nums"
                        >
                            {valuePrefix}
                            {formattedNumber(totalValue)}
                        </Typography.Text>
                    </div>
                )}

                <div className="flex flex-col gap-1">
                    {/* Main line items */}
                    {sortedEntries.map((entry: any) => (
                        <div
                            className="flex items-center justify-between gap-3 text-xs"
                            key={entry.dataKey || entry.name}
                        >
                            <div className="flex min-w-0 items-center gap-2">
                                <div
                                    className="h-2 w-2 shrink-0 rounded-full"
                                    style={{
                                        backgroundColor:
                                            entry.color ||
                                            entry.stroke ||
                                            '#1890ff',
                                    }}
                                />
                                <Typography.Text
                                    type="secondary"
                                    className="block max-w-[210px] truncate text-xs"
                                    title={entry.name || lineName}
                                >
                                    {entry.name || lineName}
                                </Typography.Text>
                            </div>
                            <Typography.Text
                                strong
                                className="shrink-0 text-right text-xs tabular-nums"
                            >
                                {valuePrefix}
                                {formattedNumber(entry.value)}
                            </Typography.Text>
                        </div>
                    ))}

                    {/* Additional metrics */}
                    {!lines.length &&
                        additionalTooltipKeys.map(
                            (cfg: TooltipKeyConfig, idx: number) => {
                                const val = originalData?.[cfg.key];
                                if (val === undefined || val === null)
                                    return null;
                                return (
                                    <div
                                        key={idx}
                                        className="flex items-center justify-between gap-3 text-xs"
                                    >
                                        <div className="flex min-w-0 items-center gap-2">
                                            <div className="h-2 w-2 shrink-0 rounded-full bg-gray-400 dark:bg-zinc-500" />
                                            <Typography.Text
                                                type="secondary"
                                                className="block max-w-[210px] truncate text-xs"
                                                title={cfg.name}
                                            >
                                                {cfg.name}:
                                            </Typography.Text>
                                        </div>
                                        <Typography.Text
                                            strong
                                            className="shrink-0 text-right text-xs tabular-nums"
                                        >
                                            {cfg.valuePrefix || ''}
                                            {formattedNumber(val)}
                                        </Typography.Text>
                                    </div>
                                );
                            }
                        )}
                </div>
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
    className = '',
    lines,
}: LineChartViewProps) {
    const messages = useTranslations();
    const renderLines = lines?.length
        ? lines
        : [{ key: lineKey, name: lineName, color: strokeColor }];

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

            {data.length === 0 ? (
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
                                    {renderLines.map((line, index) => (
                                        <linearGradient
                                            key={line.key}
                                            id={'colorLine' + index}
                                            x1="0"
                                            y1="0"
                                            x2="0"
                                            y2="1"
                                        >
                                            <stop
                                                offset="5%"
                                                stopColor={line.color}
                                                stopOpacity={0.2}
                                            />
                                            <stop
                                                offset="95%"
                                                stopColor={line.color}
                                                stopOpacity={0.01}
                                            />
                                        </linearGradient>
                                    ))}
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
                                        <CustomLineTooltip
                                            lineName={lineName}
                                            valuePrefix={valuePrefix}
                                            lines={lines}
                                            additionalTooltipKeys={
                                                additionalTooltipKeys
                                            }
                                        />
                                    }
                                    animationEasing="ease"
                                />
                                {renderLines.map((line, index) => (
                                    <Area
                                        key={line.key}
                                        type="monotone"
                                        dataKey={line.key}
                                        name={line.name}
                                        stroke={line.color}
                                        strokeWidth={2}
                                        fillOpacity={lines?.length ? 0 : 1}
                                        fill={
                                            lines?.length
                                                ? 'none'
                                                : 'url(#colorLine' + index + ')'
                                        }
                                    />
                                ))}
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            )}
        </Card>
    );
}
