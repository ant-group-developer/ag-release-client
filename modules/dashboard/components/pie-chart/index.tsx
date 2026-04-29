'use client';

import {
    ChartLegendItem,
    CustomizedPieLabel,
} from '@/components/shared/chart/chart-custom-render';
import { CustomTooltip } from '@/components/shared/chart/chart-tooltip';
import { Card, Grid, Segmented, Typography } from 'antd';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import {
    Cell,
    Legend,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
} from 'recharts';

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
                    <Title level={5} className="!m-0 !text-blue-500">
                        {title}
                    </Title>
                    <Text type="secondary" style={{ fontSize: 13 }}>
                        {subtitle}
                    </Text>
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
            <div style={{ width: '100%', height: 220 }}>
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            cx={isSmallDevice ? '50%' : '35%'}
                            cy="50%"
                            innerRadius={40}
                            outerRadius={80}
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
                            content={<CustomTooltip />}
                            isAnimationActive={true}
                        />
                        {!isSmallDevice && (
                            <Legend
                                verticalAlign="middle"
                                align="right"
                                layout="vertical"
                                wrapperStyle={{ paddingRight: 0, right: 0 }}
                                formatter={(value, entry: any) => (
                                    <ChartLegendItem
                                        label={value}
                                        value={entry.payload.value}
                                        width="200px"
                                    />
                                )}
                                iconType="circle"
                            />
                        )}
                        {isSmallDevice && (
                            <Legend
                                verticalAlign="bottom"
                                align="center"
                                layout="horizontal"
                                formatter={(value, entry: any) => (
                                    <ChartLegendItem
                                        label={value}
                                        value={entry.payload.value}
                                        width="fit-content"
                                    />
                                )}
                                iconType="circle"
                            />
                        )}
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </Card>
    );
}
