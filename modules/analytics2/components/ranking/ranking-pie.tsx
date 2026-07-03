'use client';

import { CustomizedPieLabel } from '@/components/shared/chart/chart-custom-render';
import { formattedNumber } from '@/helpers/common';
import { Empty, Grid, Skeleton, Typography } from 'antd';
import { useTranslations } from 'next-intl';
import React, { useMemo } from 'react';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

const { Text } = Typography;

interface RankingPieProps<T> {
    data: T[];
    labelKey: keyof T;
    valueKey: keyof T;
    colors?: string[];
    loading?: boolean;
    legendPosition?: 'bottom' | 'right';
    showLegend?: boolean;
    chartHeight?: number;
    valuePrefix?: string;
    pieWidth?: number | string;
}

const DEFAULT_COLORS = [
    '#4F73F5', // Primary Blue
    '#1AC191', // Success Green
    '#FFA940', // Warning Orange
    '#F759AB', // Pink
    '#722ED1', // Purple
    '#13C2C2', // Cyan
];

// Configuration constants for the pie chart dimensions and radii
const PIE_RADIUS_CONFIG = {
    RIGHT: {
        INNER: 50,
        OUTER: 90,
    },
    BOTTOM: {
        INNER: 45,
        OUTER: 85,
    },
};

const PIE_CONTAINER_HEIGHT = {
    BOTTOM_DEFAULT: 180,
    DEFAULT_RIGHT_CHART_HEIGHT: 280,
    DEFAULT_BOTTOM_CHART_HEIGHT: 260,
};

const DEFAULT_DESKTOP_PIE_WIDTH = 220;
const MAX_LEGEND_WIDTH_RIGHT = '350px';

const PieChartTooltip = ({ active, payload, valuePrefix = '' }: any) => {
    if (active && payload && payload.length) {
        const item = payload[0];
        const displayLabel = item?.name || '';
        const displayValue = item?.value || '';
        const color = item?.payload?.fill || item?.color || '#1890ff';

        return (
            <div className="flex min-w-[160px] items-center justify-between gap-4 whitespace-nowrap rounded-lg border border-[#f0f0f0] bg-white px-3 py-2 shadow-[0_4px_12px_rgba(0,0,0,0.1)] dark:border-zinc-700 dark:bg-zinc-800">
                <div className="flex items-center gap-2">
                    <div
                        className="h-2 w-2 rounded-full"
                        style={{
                            backgroundColor: color,
                        }}
                    />
                    <span className="text-[13px] font-medium text-gray-700 dark:text-zinc-300">
                        {displayLabel}
                    </span>
                </div>
                <span className="text-[13px] font-semibold text-gray-900 dark:text-zinc-100">
                    {valuePrefix}
                    {formattedNumber(displayValue)}
                </span>
            </div>
        );
    }
    return null;
};

export default function RankingPie<T>({
    data = [],
    labelKey,
    valueKey,
    colors = DEFAULT_COLORS,
    loading = false,
    legendPosition = 'right',
    showLegend = true,
    chartHeight,
    valuePrefix = '',
    pieWidth = DEFAULT_DESKTOP_PIE_WIDTH,
}: RankingPieProps<T>) {
    const messages = useTranslations();
    const finalPieWidth =
        typeof pieWidth === 'number' ? `${pieWidth}px` : pieWidth;
    const screens = Grid.useBreakpoint();
    const isSmallDevice = !screens.xxl;

    const isRight = legendPosition === 'right' && !isSmallDevice;
    const defaultHeight = isRight
        ? PIE_CONTAINER_HEIGHT.DEFAULT_RIGHT_CHART_HEIGHT
        : PIE_CONTAINER_HEIGHT.DEFAULT_BOTTOM_CHART_HEIGHT;
    const finalChartHeight = chartHeight ?? defaultHeight;

    const chartData = useMemo(() => {
        return (data || []).map((item) => ({
            type: String(item[labelKey]),
            value: Number(item[valueKey]),
        }));
    }, [data, labelKey, valueKey]);

    const containerStyle: React.CSSProperties = isRight
        ? {
              display: 'flex',
              flexDirection: isSmallDevice ? 'column' : 'row',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              minHeight: finalChartHeight,
          }
        : {
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '20px',
              height: 'auto',
          };

    const pieContainerStyle: React.CSSProperties = isRight
        ? {
              flex: isSmallDevice ? 'none' : `0 0 ${finalPieWidth}`,
              height: finalChartHeight,
              width: '100%',
              minWidth: 0,
          }
        : {
              height: PIE_CONTAINER_HEIGHT.BOTTOM_DEFAULT,
              width: '100%',
              minWidth: 0,
          };

    const legendWrapperStyle: React.CSSProperties = isRight
        ? {
              display: 'flex',
              flexDirection: isSmallDevice ? 'row' : 'column',
              flexWrap: 'wrap',
              gap: '8px',
              justifyContent: 'center',
              width: isSmallDevice ? '100%' : 'auto',
              flex: 1,
              maxWidth: isSmallDevice ? 'none' : MAX_LEGEND_WIDTH_RIGHT,
              height: isSmallDevice ? 'auto' : finalChartHeight,
              maxHeight: isSmallDevice ? 'none' : `${finalChartHeight}px`,
              overflowY: 'auto',
              paddingLeft: isSmallDevice ? 0 : '16px',
          }
        : {
              display: 'flex',
              flexDirection: 'row',
              flexWrap: 'wrap',
              gap: '8px 16px',
              justifyContent: 'center',
              width: '100%',
          };

    if (loading) {
        return (
            <div className="py-4">
                <Skeleton active paragraph={{ rows: 7 }} />
            </div>
        );
    }

    if (!chartData || chartData.length === 0) {
        return (
            <div className="flex h-[220px] items-center justify-center">
                <Empty
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description={messages('common.noDataAvailable')}
                />
            </div>
        );
    }

    return (
        <div style={{ ...containerStyle, width: '100%', padding: '16px 0' }}>
            <div style={pieContainerStyle}>
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={chartData}
                            cx="50%"
                            cy="50%"
                            innerRadius={
                                isRight
                                    ? PIE_RADIUS_CONFIG.RIGHT.INNER
                                    : PIE_RADIUS_CONFIG.BOTTOM.INNER
                            }
                            outerRadius={
                                isRight
                                    ? PIE_RADIUS_CONFIG.RIGHT.OUTER
                                    : PIE_RADIUS_CONFIG.BOTTOM.OUTER
                            }
                            stroke="none"
                            dataKey="value"
                            nameKey="type"
                            labelLine={false}
                            label={(props) => CustomizedPieLabel(props)}
                        >
                            {chartData.map((_, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={colors[index % colors.length]}
                                />
                            ))}
                        </Pie>
                        <Tooltip
                            content={
                                <PieChartTooltip valuePrefix={valuePrefix} />
                            }
                            isAnimationActive={true}
                        />
                    </PieChart>
                </ResponsiveContainer>
            </div>
            {showLegend && (
                <div style={legendWrapperStyle}>
                    {chartData.map((item, index) => {
                        const color = colors[index % colors.length];
                        const formattedVal = `${valuePrefix}${formattedNumber(item.value)}`;
                        const isRightLayout = isRight && !isSmallDevice;
                        return (
                            <div
                                key={item.type}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    width: isRightLayout ? '100%' : 'auto',
                                    minWidth: 0,
                                }}
                                title={`${item.type}: ${formattedVal}`}
                            >
                                <span
                                    style={{
                                        width: 8,
                                        height: 8,
                                        borderRadius: '50%',
                                        backgroundColor: color,
                                        display: 'inline-block',
                                        flexShrink: 0,
                                    }}
                                />
                                <div
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: isRightLayout
                                            ? 'space-between'
                                            : 'center',
                                        flex: 1,
                                        minWidth: 0,
                                        gap: isRightLayout ? '8px' : '4px',
                                    }}
                                >
                                    <Text
                                        style={{
                                            fontSize: 13,
                                            textOverflow: 'ellipsis',
                                            overflow: 'hidden',
                                            whiteSpace: 'nowrap',
                                            flex: isRightLayout ? 1 : 'none',
                                        }}
                                        className="text-gray-700 dark:text-zinc-300"
                                    >
                                        {item.type}
                                    </Text>
                                    <Text
                                        style={{
                                            color: '#8c8c8c',
                                            fontSize: 13,
                                            flexShrink: 0,
                                            whiteSpace: 'nowrap',
                                        }}
                                    >
                                        {isRightLayout
                                            ? formattedVal
                                            : `(${formattedVal})`}
                                    </Text>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
