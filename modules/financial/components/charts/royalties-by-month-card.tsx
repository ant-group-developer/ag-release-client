'use client';

import { formattedNumber } from '@/helpers/common';
import { Card, theme, Typography } from 'antd';
import { BarChart3 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import React from 'react';
import {
    Bar,
    BarChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';
import { MOCK_MONTHLY_ROYALTIES } from '../../constants/mock-data';
import { MonthlyRoyaltyItem } from '../../types';

interface RoyaltiesByMonthCardProps {
    data?: MonthlyRoyaltyItem[];
}

export const RoyaltiesByMonthCard: React.FC<RoyaltiesByMonthCardProps> = ({
    data = MOCK_MONTHLY_ROYALTIES,
}) => {
    const t = useTranslations('financial');
    const { token } = theme.useToken();

    const formatYAxis = (val: number) => {
        if (val === 0) return '0';
        return `${Math.round(val / 1000)}K`;
    };

    // Custom top label for total amount
    const renderTotalLabel = (props: any) => {
        const { x, y, width, index } = props;
        const item = data[index];
        if (!item) return <g />;
        return (
            <text
                x={x + width / 2}
                y={y - 8}
                fill={token.colorTextSecondary}
                textAnchor="middle"
                fontSize={11}
                fontWeight={600}
            >
                ${formattedNumber(item.total, undefined, true)}
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
            <div className="mb-6 flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-indigo-500" />
                <Typography.Title
                    level={4}
                    style={{ margin: 0, fontWeight: 600 }}
                >
                    {t('royaltiesByMonth')}
                </Typography.Title>
            </div>

            <div className="min-h-[300px] w-full flex-1">
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                        data={data}
                        margin={{ top: 25, right: 15, left: -15, bottom: 0 }}
                        barSize={38}
                    >
                        <CartesianGrid
                            strokeDasharray="3 3"
                            vertical={false}
                            stroke={token.colorBorderSecondary}
                            opacity={0.6}
                        />
                        <XAxis
                            dataKey="month"
                            axisLine={false}
                            tickLine={false}
                            tick={{
                                fill: token.colorTextTertiary,
                                fontSize: 12,
                            }}
                            dy={10}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{
                                fill: token.colorTextTertiary,
                                fontSize: 12,
                            }}
                            tickFormatter={formatYAxis}
                            domain={[0, 130000]}
                            ticks={[0, 30000, 60000, 90000, 120000]}
                        />
                        <Tooltip
                            content={({ active, payload, label }) => {
                                if (active && payload && payload.length) {
                                    const current = payload[0]
                                        ?.payload as MonthlyRoyaltyItem;
                                    return (
                                        <div
                                            className="rounded-lg border p-3 text-xs shadow-xl"
                                            style={{
                                                backgroundColor:
                                                    token.colorBgElevated,
                                                borderColor:
                                                    token.colorBorderSecondary,
                                            }}
                                        >
                                            <div
                                                className="mb-2 border-b pb-1 font-bold"
                                                style={{
                                                    borderColor:
                                                        token.colorBorderSecondary,
                                                }}
                                            >
                                                <Typography.Text strong>
                                                    {label}
                                                </Typography.Text>
                                                <div className="mt-0.5 text-sm font-bold">
                                                    $
                                                    {formattedNumber(
                                                        current?.total
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex flex-col gap-1.5">
                                                <div className="flex items-center justify-between gap-4">
                                                    <span className="flex items-center gap-1.5">
                                                        <span className="h-2.5 w-2.5 rounded-full bg-[#10B981]" />
                                                        <Typography.Text type="secondary">
                                                            {t('paid')}:
                                                        </Typography.Text>
                                                    </span>
                                                    <Typography.Text strong>
                                                        $
                                                        {formattedNumber(
                                                            current?.paid
                                                        )}
                                                    </Typography.Text>
                                                </div>
                                                <div className="flex items-center justify-between gap-4">
                                                    <span className="flex items-center gap-1.5">
                                                        <span className="h-2.5 w-2.5 rounded-full bg-[#F59E0B]" />
                                                        <Typography.Text type="secondary">
                                                            {t('pending')}:
                                                        </Typography.Text>
                                                    </span>
                                                    <Typography.Text strong>
                                                        $
                                                        {formattedNumber(
                                                            current?.pending
                                                        )}
                                                    </Typography.Text>
                                                </div>
                                                <div className="flex items-center justify-between gap-4">
                                                    <span className="flex items-center gap-1.5">
                                                        <span className="h-2.5 w-2.5 rounded-full bg-[#3B82F6]" />
                                                        <Typography.Text type="secondary">
                                                            {t('available')}:
                                                        </Typography.Text>
                                                    </span>
                                                    <Typography.Text strong>
                                                        $
                                                        {formattedNumber(
                                                            current?.available
                                                        )}
                                                    </Typography.Text>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                }
                                return null;
                            }}
                        />
                        <Bar dataKey="paid" stackId="a" fill="#10B981" />
                        <Bar dataKey="pending" stackId="a" fill="#F59E0B" />
                        <Bar
                            dataKey="available"
                            stackId="a"
                            fill="#3B82F6"
                            radius={[6, 6, 0, 0]}
                            label={renderTotalLabel}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Custom Bottom Legend */}
            <div
                className="mt-4 flex items-center justify-center gap-6 border-t pt-3"
                style={{ borderColor: token.colorBorderSecondary }}
            >
                <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-[#10B981]" />
                    <Typography.Text type="secondary" className="text-xs">
                        {t('paid')}
                    </Typography.Text>
                </div>
                <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-[#F59E0B]" />
                    <Typography.Text type="secondary" className="text-xs">
                        {t('pending')}
                    </Typography.Text>
                </div>
                <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-[#3B82F6]" />
                    <Typography.Text type="secondary" className="text-xs">
                        {t('available')}
                    </Typography.Text>
                </div>
            </div>
        </Card>
    );
};
