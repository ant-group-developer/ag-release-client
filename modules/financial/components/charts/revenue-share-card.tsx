'use client';

import { formattedNumber } from '@/helpers/common';
import { Card, theme, Typography } from 'antd';
import { PieChart as PieChartIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import React from 'react';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { MOCK_REVENUE_SHARES } from '../../constants/mock-data';
import { RevenueShareItem } from '../../types';

interface RevenueShareCardProps {
    data?: RevenueShareItem[];
    totalAmount?: number;
}

export const RevenueShareCard: React.FC<RevenueShareCardProps> = ({
    data = MOCK_REVENUE_SHARES,
}) => {
    const t = useTranslations('financial');
    const { token } = theme.useToken();

    // Render percent label directly inside slices
    const renderCustomizedLabel = ({
        cx,
        cy,
        midAngle,
        innerRadius,
        outerRadius,
        percent,
        share,
    }: any) => {
        const RADIAN = Math.PI / 180;
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);

        if (share < 5) return null;

        return (
            <text
                x={x}
                y={y}
                fill="#ffffff"
                textAnchor="middle"
                dominantBaseline="central"
                fontSize={10}
                fontWeight={600}
            >
                {`${share}%`}
            </text>
        );
    };

    return (
        <Card
            className="h-full rounded-xl border shadow-sm"
            style={{
                backgroundColor: token.colorBgContainer,
                borderColor: token.colorBorderSecondary,
            }}
            styles={{
                body: {
                    padding: '20px',
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%',
                },
            }}
        >
            <div className="mb-4 flex items-center gap-2">
                <PieChartIcon className="h-5 w-5 text-indigo-500" />
                <Typography.Title
                    level={4}
                    style={{ margin: 0, fontWeight: 600 }}
                >
                    {t('revenueShareByArtistLabel')}
                </Typography.Title>
            </div>

            <div className="grid flex-1 grid-cols-1 items-center gap-4 md:grid-cols-12">
                {/* Donut Chart Container */}
                <div className="relative flex h-[260px] w-full items-center justify-center md:col-span-5">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Tooltip
                                content={({ active, payload }) => {
                                    if (active && payload && payload.length) {
                                        const item = payload[0]
                                            ?.payload as RevenueShareItem;
                                        return (
                                            <div
                                                className="rounded-lg border p-2.5 text-xs shadow-xl"
                                                style={{
                                                    backgroundColor:
                                                        token.colorBgElevated,
                                                    borderColor:
                                                        token.colorBorderSecondary,
                                                }}
                                            >
                                                <div className="mb-1 flex items-center gap-2 font-bold">
                                                    <span
                                                        className="h-2.5 w-2.5 rounded-full"
                                                        style={{
                                                            backgroundColor:
                                                                item.color,
                                                        }}
                                                    />
                                                    <span>{item.name}</span>
                                                </div>
                                                <div className="flex justify-between gap-4">
                                                    <Typography.Text type="secondary">
                                                        {t('share')}:
                                                    </Typography.Text>
                                                    <Typography.Text strong>
                                                        {item.share}%
                                                    </Typography.Text>
                                                </div>
                                                <div className="flex justify-between gap-4">
                                                    <Typography.Text type="secondary">
                                                        {t('revenue')}:
                                                    </Typography.Text>
                                                    <Typography.Text strong>
                                                        $
                                                        {formattedNumber(
                                                            item.revenue
                                                        )}
                                                    </Typography.Text>
                                                </div>
                                            </div>
                                        );
                                    }
                                    return null;
                                }}
                            />
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                innerRadius={45}
                                outerRadius={92}
                                paddingAngle={0}
                                dataKey="share"
                                labelLine={false}
                                label={renderCustomizedLabel}
                            >
                                {data.map((entry) => (
                                    <Cell
                                        key={`cell-${entry.id}`}
                                        fill={entry.color}
                                        stroke="none"
                                        strokeWidth={0}
                                    />
                                ))}
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                {/* Legend Table / List */}
                <div className="flex flex-col justify-center gap-2 pl-1 md:col-span-7">
                    <div
                        className="grid grid-cols-12 gap-3 border-b pb-1.5 text-xs font-semibold"
                        style={{ borderColor: token.colorBorderSecondary }}
                    >
                        <div className="col-span-5 truncate">
                            <Typography.Text type="secondary">
                                {t('artistLabel')}
                            </Typography.Text>
                        </div>
                        <div className="col-span-3 text-right">
                            <Typography.Text type="secondary">
                                {t('share')}
                            </Typography.Text>
                        </div>
                        <div className="col-span-4 text-right">
                            <Typography.Text type="secondary">
                                {t('revenue')}
                            </Typography.Text>
                        </div>
                    </div>

                    <div className="flex flex-col gap-2.5">
                        {data.map((item) => (
                            <div
                                key={item.id}
                                className="grid grid-cols-12 items-center gap-3 text-xs transition-opacity hover:opacity-85"
                            >
                                <div className="col-span-5 flex items-center gap-2 truncate">
                                    <span
                                        className="h-2.5 w-2.5 flex-shrink-0 rounded-full"
                                        style={{ backgroundColor: item.color }}
                                    />
                                    <Typography.Text
                                        ellipsis
                                        className="font-medium"
                                    >
                                        {item.name}
                                    </Typography.Text>
                                </div>
                                <div className="col-span-3 text-right font-medium">
                                    <Typography.Text>
                                        {item.share}%
                                    </Typography.Text>
                                </div>
                                <div className="col-span-4 text-right font-semibold">
                                    <Typography.Text>
                                        $
                                        {item.revenue.toLocaleString('en-US', {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2,
                                        })}
                                    </Typography.Text>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </Card>
    );
};
