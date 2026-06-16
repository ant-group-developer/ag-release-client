import { CustomizedPieLabel } from '@/components/shared/chart/chart-custom-render';
import { formattedNumber } from '@/helpers/common';
import { Card, Empty, Grid, Skeleton, Typography } from 'antd';
import { useTranslations } from 'next-intl';
import React from 'react';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

const { Title, Text } = Typography;

interface DataItem {
    type: string;
    value: number;
}

interface PieChartViewProps {
    title: string;
    subtitle?: string;
    data: DataItem[];
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

const PieChartTooltip = ({ active, payload, valuePrefix = '' }: any) => {
    if (active && payload && payload.length) {
        const item = payload[0];
        const displayLabel = item?.name || '';
        const displayValue = item?.value || '';
        const color = item?.payload?.fill || item?.color || '#1890ff';

        return (
            <div
                style={{
                    backgroundColor: '#fff',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    border: '1px solid #f0f0f0',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    justifyContent: 'space-between',
                    minWidth: '160px',
                    whiteSpace: 'nowrap',
                }}
            >
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
                            backgroundColor: color,
                        }}
                    />
                    <Typography.Text style={{ fontSize: 13, fontWeight: 500 }}>
                        {displayLabel}
                    </Typography.Text>
                </div>
                <Typography.Text style={{ fontWeight: 600, fontSize: 13 }}>
                    {valuePrefix}
                    {formattedNumber(displayValue)}
                </Typography.Text>
            </div>
        );
    }
    return null;
};

export default function PieChartView({
    title,
    subtitle,
    data = [],
    colors = DEFAULT_COLORS,
    loading = false,
    legendPosition = 'bottom',
    showLegend = true,
    chartHeight,
    valuePrefix = '',
    pieWidth = DEFAULT_DESKTOP_PIE_WIDTH,
}: PieChartViewProps) {
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
              justifyContent: isSmallDevice ? 'center' : 'flex-start',
              width: isSmallDevice ? '100%' : 'auto',
              flex: 1,
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
            <div>
                <Title level={5} className="!m-0">
                    {title}
                </Title>
                {subtitle && (
                    <Text type="secondary" style={{ fontSize: 13 }}>
                        {subtitle}
                    </Text>
                )}
            </div>

            {loading ? (
                <div
                    style={{
                        flex: 1,
                        display: 'flex',
                        alignItems: 'center',
                    }}
                >
                    <Skeleton active paragraph={{ rows: 7 }} />
                </div>
            ) : data && data.length > 0 ? (
                <div style={{ ...containerStyle, flex: 1 }}>
                    <div style={pieContainerStyle}>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={data}
                                    cx={isRight ? '45%' : '50%'}
                                    cy={isRight ? '45%' : '50%'}
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
                                    {data.map((_, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={colors[index % colors.length]}
                                        />
                                    ))}
                                </Pie>
                                <Tooltip
                                    content={
                                        <PieChartTooltip
                                            valuePrefix={valuePrefix}
                                        />
                                    }
                                    isAnimationActive={true}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    {showLegend && (
                        <div style={legendWrapperStyle}>
                            {data.map((item, index) => {
                                const color = colors[index % colors.length];
                                const formattedVal = `${valuePrefix}${formattedNumber(
                                    item.value
                                )}`;
                                const isRightLayout = isRight && !isSmallDevice;
                                return (
                                    <div
                                        key={item.type}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '6px',
                                            width: isRightLayout
                                                ? '100%'
                                                : 'auto',
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
                                                    : 'flex-start',
                                                flex: 1,
                                                minWidth: 0,
                                                gap: isRightLayout
                                                    ? '8px'
                                                    : '4px',
                                            }}
                                        >
                                            <Text
                                                style={{
                                                    fontSize: 13,
                                                    textOverflow: 'ellipsis',
                                                    overflow: 'hidden',
                                                    whiteSpace: 'nowrap',
                                                    flex: isRightLayout
                                                        ? 1
                                                        : 'none',
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
            ) : (
                <div
                    style={{
                        height: 220,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <Empty
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                        description={messages('common.noDataAvailable')}
                    />
                </div>
            )}
        </Card>
    );
}
