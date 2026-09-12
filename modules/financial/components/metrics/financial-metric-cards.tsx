'use client';

import { formattedNumber } from '@/helpers/common';
import {
    ArrowUp,
    CheckCircle2,
    CircleDollarSign,
    Clock,
    CreditCard,
} from 'lucide-react';
import { Card, Progress, theme, Typography } from 'antd';
import { useTranslations } from 'next-intl';
import React from 'react';
import { MOCK_SUMMARY_METRICS } from '../../constants/mock-data';

interface FinancialMetricCardsProps {
    data?: typeof MOCK_SUMMARY_METRICS;
}

export const FinancialMetricCards: React.FC<FinancialMetricCardsProps> = ({
    data = MOCK_SUMMARY_METRICS,
}) => {
    const t = useTranslations('financial');
    const { token } = theme.useToken();

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card 1: Total Royalties */}
            <Card
                className="rounded-xl border shadow-sm"
                style={{
                    backgroundColor: token.colorBgContainer,
                    borderColor: token.colorBorderSecondary,
                }}
                styles={{ body: { padding: '20px' } }}
            >
                <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-indigo-500/10 text-indigo-500">
                        <CircleDollarSign className="w-5 h-5" />
                    </div>
                    <Typography.Text type="secondary" className="text-sm font-medium">
                        {t('totalRoyalties')}
                    </Typography.Text>
                </div>

                <div className="flex items-baseline justify-between">
                    <div>
                        <Typography.Title level={3} style={{ margin: 0, fontWeight: 700 }}>
                            $ {formattedNumber(data.totalRoyalties.amount)}
                        </Typography.Title>
                        <div className="flex items-center gap-1 mt-1">
                            <span className="flex items-center text-xs font-semibold text-emerald-500">
                                <ArrowUp className="w-3.5 h-3.5 mr-0.5" />
                                {data.totalRoyalties.growth}%
                            </span>
                            <Typography.Text type="secondary" className="text-xs">
                                {t('vsPrevious6Months')}
                            </Typography.Text>
                        </div>
                    </div>

                    {/* Mini Sparkline Graph */}
                    <div className="w-20 h-10">
                        <svg
                            viewBox="0 0 100 45"
                            className="w-full h-full overflow-visible"
                        >
                            <defs>
                                <linearGradient
                                    id="sparkline-grad"
                                    x1="0%"
                                    y1="0%"
                                    x2="0%"
                                    y2="100%"
                                >
                                    <stop
                                        offset="0%"
                                        stopColor="#3B82F6"
                                        stopOpacity={0.3}
                                    />
                                    <stop
                                        offset="100%"
                                        stopColor="#3B82F6"
                                        stopOpacity={0.0}
                                    />
                                </linearGradient>
                            </defs>
                            <path
                                d="M 0 35 Q 18 38, 30 28 T 60 22 T 80 14 L 100 6 L 100 45 L 0 45 Z"
                                fill="url(#sparkline-grad)"
                            />
                            <path
                                d="M 0 35 Q 18 38, 30 28 T 60 22 T 80 14 L 100 6"
                                fill="none"
                                stroke="#3B82F6"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </div>
                </div>
            </Card>

            {/* Card 2: Paid */}
            <Card
                className="rounded-xl border shadow-sm"
                style={{
                    backgroundColor: token.colorBgContainer,
                    borderColor: token.colorBorderSecondary,
                }}
                styles={{ body: { padding: '20px' } }}
            >
                <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-emerald-500/10 text-emerald-500">
                        <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <Typography.Text type="secondary" className="text-sm font-medium">
                        {t('paid')}
                    </Typography.Text>
                </div>

                <div className="flex flex-col gap-2">
                    <Typography.Title level={3} style={{ margin: 0, fontWeight: 700 }}>
                        $ {formattedNumber(data.paid.amount)}
                    </Typography.Title>
                    <Typography.Text type="secondary" className="text-xs font-medium">
                        {data.paid.percentage}%
                    </Typography.Text>
                    <Progress
                        percent={data.paid.percentage}
                        strokeColor="#10B981"
                        trailColor={token.colorFillSecondary}
                        showInfo={false}
                        size={['100%', 6]}
                    />
                </div>
            </Card>

            {/* Card 3: Pending */}
            <Card
                className="rounded-xl border shadow-sm"
                style={{
                    backgroundColor: token.colorBgContainer,
                    borderColor: token.colorBorderSecondary,
                }}
                styles={{ body: { padding: '20px' } }}
            >
                <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-amber-500/10 text-amber-500">
                        <Clock className="w-5 h-5" />
                    </div>
                    <Typography.Text type="secondary" className="text-sm font-medium">
                        {t('pending')}
                    </Typography.Text>
                </div>

                <div className="flex flex-col gap-2">
                    <Typography.Title level={3} style={{ margin: 0, fontWeight: 700 }}>
                        $ {formattedNumber(data.pending.amount)}
                    </Typography.Title>
                    <Typography.Text type="secondary" className="text-xs font-medium">
                        {data.pending.percentage}%
                    </Typography.Text>
                    <Progress
                        percent={data.pending.percentage}
                        strokeColor="#F59E0B"
                        trailColor={token.colorFillSecondary}
                        showInfo={false}
                        size={['100%', 6]}
                    />
                </div>
            </Card>

            {/* Card 4: Available */}
            <Card
                className="rounded-xl border shadow-sm"
                style={{
                    backgroundColor: token.colorBgContainer,
                    borderColor: token.colorBorderSecondary,
                }}
                styles={{ body: { padding: '20px' } }}
            >
                <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-blue-500/10 text-blue-500">
                        <CreditCard className="w-5 h-5" />
                    </div>
                    <Typography.Text type="secondary" className="text-sm font-medium">
                        {t('available')}
                    </Typography.Text>
                </div>

                <div className="flex flex-col gap-2">
                    <Typography.Title level={3} style={{ margin: 0, fontWeight: 700 }}>
                        $ {formattedNumber(data.available.amount)}
                    </Typography.Title>
                    <Typography.Text type="secondary" className="text-xs font-medium">
                        {data.available.percentage}%
                    </Typography.Text>
                    <Progress
                        percent={data.available.percentage}
                        strokeColor="#3B82F6"
                        trailColor={token.colorFillSecondary}
                        showInfo={false}
                        size={['100%', 6]}
                    />
                </div>
            </Card>
        </div>
    );
};
