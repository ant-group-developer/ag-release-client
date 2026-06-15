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

interface LineChartViewProps {
    title: string;
    data: any[];
    xAxisKey: string;
    lineKey: string;
    lineName: string;
    strokeColor?: string;
    chartHeight?: number;
    loading?: boolean;
    valuePrefix?: string;
    additionalTooltipKeys?: TooltipKeyConfig[];
}

const CustomLineTooltip = ({
    active,
    payload,
    label,
    lineName,
    valuePrefix = '',
    additionalTooltipKeys = [],
}: any) => {
    if (active && payload && payload.length) {
        const firstEntry = payload[0];
        const originalData = firstEntry.payload;

        return (
            <div
                style={{
                    backgroundColor: '#fff',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    border: '1px solid #f0f0f0',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px',
                }}
            >
                <Typography.Text style={{ fontWeight: 600, fontSize: '13px' }}>
                    {label}
                </Typography.Text>
                
                {/* Main line item */}
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                    }}
                >
                    <div
                        style={{
                            width: '8px',
                            height: '8px',
                            borderRadius: '50%',
                            backgroundColor:
                                firstEntry.color || firstEntry.stroke || '#1890ff',
                        }}
                    />
                    <Typography.Text style={{ fontSize: '12px' }}>
                        {firstEntry.name || lineName}:
                    </Typography.Text>
                    <Typography.Text
                        style={{
                            fontWeight: 600,
                            fontSize: '12px',
                            marginLeft: '4px',
                        }}
                    >
                        {valuePrefix}{formattedNumber(firstEntry.value)}
                    </Typography.Text>
                </div>

                {/* Additional metrics */}
                {additionalTooltipKeys.map((cfg: TooltipKeyConfig, idx: number) => {
                    const val = originalData?.[cfg.key];
                    if (val === undefined || val === null) return null;
                    return (
                        <div
                            key={idx}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                            }}
                        >
                            <div
                                style={{
                                    width: '8px',
                                    height: '8px',
                                    borderRadius: '50%',
                                    backgroundColor: '#8c8c8c',
                                }}
                            />
                            <Typography.Text style={{ fontSize: '12px' }}>
                                {cfg.name}:
                            </Typography.Text>
                            <Typography.Text
                                style={{
                                    fontWeight: 600,
                                    fontSize: '12px',
                                    marginLeft: '4px',
                                }}
                            >
                                {cfg.valuePrefix || ''}{formattedNumber(val)}
                            </Typography.Text>
                        </div>
                    );
                })}
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
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <span className="text-base font-bold">{title}</span>
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
                                            additionalTooltipKeys={additionalTooltipKeys}
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
