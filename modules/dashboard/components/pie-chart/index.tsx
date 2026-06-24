'use client';

import { CustomizedPieLabel } from '@/components/shared/chart/chart-custom-render';

import { formattedNumber } from '@/helpers/common';
import { Card, Empty, Grid, Segmented, Typography } from 'antd';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

const { Title, Text } = Typography;

interface DataItem {
    type: string;
    value: number;
}

interface DistributionPieChartProps {
    title: string;
    subtitle: string;
    streamData: DataItem[];
    revenueData: DataItem[];
    colors: string[];
}

const PieChartTooltip = ({ active, payload }: any) => {
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
                <Typography.Text
                    style={{
                        fontWeight: 600,
                        fontSize: 13,
                    }}
                >
                    {formattedNumber(displayValue)}
                </Typography.Text>
            </div>
        );
    }
    return null;
};

export default function DistributionPieChart({
    title,
    subtitle,
    streamData,
    revenueData,
    colors,
}: DistributionPieChartProps) {
    const messages = useTranslations();
    // const { token } = theme.useToken();
    const screens = Grid.useBreakpoint();
    const isSmallDevice = !screens.xxl;

    const [mode, setMode] = useState<'stream' | 'revenue'>('stream');

    const data = mode === 'stream' ? streamData : revenueData;

    return (
        <Card
            styles={{ body: { padding: '20px 24px' } }}
            style={{
                borderRadius: 8,
                height: '100%',
            }}
        >
            <div className="mb-4 flex items-start justify-between">
                <div>
                    <Typography.Title level={5} className="!m-0">
                        {title}
                    </Typography.Title>
                    <Typography.Text type="secondary" style={{ fontSize: 13 }}>
                        {subtitle}
                    </Typography.Text>
                </div>
                <Segmented
                    options={[
                        { label: messages('common.streams'), value: 'stream' },
                        { label: messages('common.revenue'), value: 'revenue' },
                    ]}
                    value={mode}
                    onChange={(value) => setMode(value as 'stream' | 'revenue')}
                    size="small"
                />
            </div>
            <div>
                {data && data.length > 0 ? (
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: isSmallDevice ? 'column' : 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: isSmallDevice ? '12px' : '24px',
                            height: isSmallDevice ? 260 : 220,
                        }}
                    >
                        <div
                            style={{
                                flex: isSmallDevice ? 'none' : 1,
                                height: isSmallDevice ? 160 : 220,
                                width: '100%',
                                minWidth: 0,
                            }}
                        >
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={data}
                                        cx="50%"
                                        cy="40%"
                                        innerRadius={40}
                                        outerRadius={80}
                                        stroke="none"
                                        dataKey="value"
                                        nameKey="type"
                                        labelLine={false}
                                        label={(props) =>
                                            CustomizedPieLabel(props)
                                        }
                                    >
                                        {data.map((_, index) => (
                                            <Cell
                                                key={`cell-${index}`}
                                                fill={
                                                    colors[
                                                        index % colors.length
                                                    ]
                                                }
                                            />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        content={<PieChartTooltip />}
                                        isAnimationActive={true}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: isSmallDevice ? 'row' : 'column',
                                flexWrap: 'wrap',
                                gap: '8px',
                                justifyContent: isSmallDevice
                                    ? 'center'
                                    : 'flex-start',
                                width: isSmallDevice ? '100%' : '200px',
                                flex: isSmallDevice ? 1 : 'none',
                                height: isSmallDevice ? 'auto' : 220,
                                maxHeight: isSmallDevice ? 'none' : '220px',
                                overflow: 'hidden',
                                paddingLeft: isSmallDevice ? 0 : '12px',
                            }}
                        >
                            {data.map((item, index) => {
                                const color = colors[index % colors.length];
                                const formattedVal = formattedNumber(
                                    item.value
                                );
                                return (
                                    <div
                                        key={item.type}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px',
                                            width: isSmallDevice
                                                ? 'auto'
                                                : '100%',
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
                                                justifyContent: 'space-between',
                                                flex: 1,
                                                minWidth: 0,
                                                gap: '8px',
                                            }}
                                        >
                                            <Text
                                                style={{
                                                    flex: 1,
                                                    minWidth: 0,
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    whiteSpace: 'nowrap',
                                                    fontSize: 14,
                                                }}
                                            >
                                                {item.type}
                                            </Text>
                                            <Text
                                                style={{
                                                    color: '#8c8c8c',
                                                    flexShrink: 0,
                                                    whiteSpace: 'nowrap',
                                                    fontSize: 14,
                                                }}
                                            >
                                                {formattedVal}
                                            </Text>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
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
            </div>
        </Card>
    );
}
