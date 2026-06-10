'use client';

import { theme, Card, Segmented, Select, Row, Col, Statistic, Spin, Empty, Space, Typography } from 'antd';
import { DollarSign, Globe, Music } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';
import dayjs from 'dayjs';
import { useGetDspTimeline } from '@/modules/analytics2/hooks/use-get-dsp-timeline';
import { useGetDspSalesTimeline } from '@/modules/analytics2/hooks/use-get-dsp-sales-timeline';
import { useGetRevenueSummary, useGetRevenueTimeline } from '@/modules/analytics2/hooks/use-get-revenue-data';
import { useGetTerTimeline } from '@/modules/analytics2/hooks/use-get-ter-timeline';
import {
    DSP_PALETTE,
    transformBarData,
    transformSalesBarData,
} from '@/modules/analytics2/helpers/analytics-chart-helper';
import BarView from '@/modules/analytics2/components/chart/bar-view';
import { SalesTooltip, ThreeColumnTooltip } from '@/components/shared/chart/chart-tooltip';
import { formatCurrency, formattedNumber } from '@/helpers/common';

interface Props {
    startDate?: string;
    endDate?: string;
}

export default function DashboardAnalyticsRow({ startDate, endDate }: Props) {
    const messages = useTranslations();
    const { token } = theme.useToken();

    const [viewMode, setViewMode] = useState<'trend' | 'sales'>('trend');
    const [chartType, setChartType] = useState<'dsp' | 'ter' | 'revenue'>('dsp');

    const fromDate = useMemo(() => {
        return startDate ? dayjs(startDate).format('YYYY-MM-DD') : dayjs().subtract(30, 'day').format('YYYY-MM-DD');
    }, [startDate]);

    const toDate = useMemo(() => {
        return endDate ? dayjs(endDate).format('YYYY-MM-DD') : dayjs().format('YYYY-MM-DD');
    }, [endDate]);

    // Fetch Trend Timeline Data
    const { timelineData: trendData, isFetching: isFetchingTrends, isSuccess: isSuccessTrends } = useGetDspTimeline({
        fromDate,
        toDate,
        topN: 5,
        includeOther: true,
    });

    // Fetch Sales Timeline Data
    const { timelineData: salesData, isFetching: isFetchingSales, isSuccess: isSuccessSales } = useGetDspSalesTimeline({
        fromDate,
        toDate,
        topN: 5,
        includeOther: true,
    });

    // Fetch Territory Timeline Data
    const { timelineData: terData, isFetching: isFetchingTer } = useGetTerTimeline({
        fromDate,
        toDate,
        topN: 5,
        includeOther: true,
    });

    // Fetch Revenue Timeline Data
    const { timelineData: revenueTimelineData, isFetching: isFetchingRevenueTimeline } = useGetRevenueTimeline({
        fromDate,
        toDate,
        topN: 5,
        includeOther: true,
    });

    // Fetch Revenue Summary Data
    const { summaryData, isFetching: isFetchingSummary } = useGetRevenueSummary({
        fromDate,
        toDate,
    });

    const hasTrend = isSuccessTrends;
    const hasSales = isSuccessSales;

    const activeViewMode = useMemo(() => {
        if (!hasTrend && hasSales) return 'sales';
        if (hasTrend && !hasSales) return 'trend';
        return viewMode;
    }, [hasTrend, hasSales, viewMode]);

    const isFetchingTimeline = useMemo(() => {
        if (chartType === 'dsp') return activeViewMode === 'trend' ? isFetchingTrends : isFetchingSales;
        if (chartType === 'ter') return isFetchingTer;
        return isFetchingRevenueTimeline;
    }, [chartType, activeViewMode, isFetchingTrends, isFetchingSales, isFetchingTer, isFetchingRevenueTimeline]);

    // Resolve active dataset based on chartType and activeViewMode
    const activeData = useMemo(() => {
        if (chartType === 'dsp') {
            if (activeViewMode === 'trend') {
                const topDsps = trendData?.topDsps ?? [];
                const items = trendData?.items ?? [];
                const barData = transformBarData(items);
                return { keys: topDsps, items, barData };
            } else {
                const topDsps = salesData?.topDsps ?? [];
                const items = salesData?.items ?? [];
                const barData = transformSalesBarData(items);
                return { keys: topDsps, items, barData };
            }
        } else if (chartType === 'ter') {
            const topTers = terData?.topTerritories ?? [];
            const items = terData?.items ?? [];
            const barData = items.map((item) => {
                const row: Record<string, any> = { period: item.period };
                item.series.forEach(({ territory, trendViews }) => {
                    row[territory] = trendViews;
                });
                return row;
            });
            return { keys: topTers, items, barData };
        } else {
            // chartType === 'revenue'
            const topDsps = revenueTimelineData?.topDsps ?? [];
            const items = revenueTimelineData?.items ?? [];
            const barData = items.map((item) => {
                const row: Record<string, any> = { period: item.period };
                item.series.forEach(({ dsp, revenueUsd, quantity }) => {
                    row[dsp] = revenueUsd;
                    row[`${dsp}Quantity`] = quantity;
                });
                return row;
            });
            return { keys: topDsps, items, barData };
        }
    }, [chartType, activeViewMode, trendData, salesData, terData, revenueTimelineData]);

    const colorMap = useMemo(() => {
        const map: Record<string, string> = {};
        activeData.keys.forEach((key, i) => {
            map[key] = DSP_PALETTE[i % DSP_PALETTE.length];
        });
        map['Other'] = '#94a3b8';
        return map;
    }, [activeData.keys]);

    const allKeys = useMemo(() => {
        const keys = new Set<string>();
        const totals: Record<string, number> = {};

        activeData.barData.forEach((row) => {
            Object.entries(row).forEach(([key, value]) => {
                if (key === 'period' || key.endsWith('RevenueUsd')) return;

                keys.add(key);
                totals[key] = (totals[key] ?? 0) + (Number(value) || 0);
            });
        });

        return Array.from(keys).sort((a, b) => {
            const totalDiff = (totals[b] ?? 0) - (totals[a] ?? 0);
            return totalDiff || a.localeCompare(b);
        });
    }, [activeData.barData]);

    // Summary Metric Options
    const selectOptions = [
        { value: 'dsp', label: 'DSP' },
        { value: 'ter', label: messages('analytics.revenue.totalTerritories') },
        { value: 'revenue', label: messages('analytics.revenue.totalRevenue') },
    ];

    // Selected statistic formatting and details
    const selectedStatDetails = useMemo(() => {
        switch (chartType) {
            case 'revenue':
                return {
                    label: messages('analytics.revenue.totalRevenue'),
                    value: summaryData?.totalRevenueUsd
                        ? formatCurrency(summaryData.totalRevenueUsd, 'USD')
                        : '$0.00',
                    icon: DollarSign,
                    colorClass: 'text-emerald-600 dark:text-emerald-400',
                    bgClass: 'bg-emerald-50 dark:bg-emerald-950/30',
                };
            case 'dsp':
                return {
                    label: messages('analytics.revenue.totalPlays'),
                    value: summaryData?.totalQuantity
                        ? formattedNumber(summaryData.totalQuantity)
                        : '0',
                    icon: Music,
                    colorClass: 'text-blue-600 dark:text-blue-400',
                    bgClass: 'bg-blue-50 dark:bg-blue-950/30',
                };
            case 'ter':
                return {
                    label: messages('analytics.revenue.totalTerritories'),
                    value: summaryData?.totalTerritories
                        ? formattedNumber(summaryData.totalTerritories)
                        : '0',
                    icon: Globe,
                    colorClass: 'text-purple-600 dark:text-purple-400',
                    bgClass: 'bg-purple-50 dark:bg-purple-950/30',
                };
            default:
                return {
                    label: '',
                    value: '0',
                    icon: DollarSign,
                    colorClass: '',
                    bgClass: '',
                };
        }
    }, [chartType, summaryData, messages]);

    const tooltipComponent = useMemo(() => {
        if (chartType === 'revenue') {
            return (
                <ThreeColumnTooltip
                    headers={[
                        messages('analytics.chart.dsp'),
                        messages('analytics.revenue.label'),
                        messages('analytics.chart.view'),
                    ]}
                    primaryFormatter={(v) => formatCurrency(Number(v) || 0, 'USD')}
                    extraColumn={{
                        metaKey: 'Quantity',
                        formatter: (value) => formattedNumber(value as any, undefined, false),
                    }}
                />
            );
        }
        if (chartType === 'dsp' && activeViewMode === 'sales') {
            return <SalesTooltip />;
        }
        return undefined;
    }, [chartType, activeViewMode, messages]);

    const tooltipHeaders = useMemo(() => {
        if (chartType === 'ter') {
            return [
                messages('analytics.revenue.totalTerritories'),
                messages('analytics.chart.view'),
            ] as [string, string];
        }
        return [
            messages('analytics.chart.dsp'),
            messages('analytics.chart.view'),
        ] as [string, string];
    }, [chartType, messages]);

    const yAxisFormatter = useMemo(() => {
        if (chartType === 'revenue') {
            return (v: any) => `$${formattedNumber(v, undefined as any, true)}`;
        }
        return undefined;
    }, [chartType]);

    const IconComponent = selectedStatDetails.icon;

    return (
        <Card
            className="rounded-xl border-none shadow-sm"
            styles={{ body: { padding: '24px' } }}
        >
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                <Typography.Title level={4} style={{ margin: 0, fontSize: '16px', fontWeight: 'bold' }}>
                    {messages('common.statistics')} {messages('common.undetermined').toLowerCase() === 'chưa xác định' ? 'Lượt nghe & Doanh thu' : 'Plays & Revenue'}
                </Typography.Title>

                <Space size="middle" wrap>
                    {chartType === 'dsp' && hasTrend && hasSales && (
                        <Segmented
                            value={activeViewMode}
                            onChange={(value) => setViewMode(value as 'trend' | 'sales')}
                            options={[
                                { label: messages('analytics.chart.trends'), value: 'trend' },
                                { label: messages('analytics.chart.sales'), value: 'sales' },
                            ]}
                        />
                    )}

                    <Select
                        style={{ width: 220 }}
                        value={chartType}
                        onChange={(value) => setChartType(value)}
                        options={selectOptions}
                    />
                </Space>
            </div>

            <Row gutter={[24, 24]} align="stretch">
                <Col xs={24} md={6}>
                    <div 
                        className="flex h-full flex-col justify-center rounded-xl p-6 border border-gray-100 dark:border-zinc-800 transition-all hover:shadow-md"
                        style={{ 
                            backgroundColor: token.colorBgContainer,
                            minHeight: '180px'
                        }}
                    >
                        {isFetchingSummary ? (
                            <div className="flex h-full items-center justify-center">
                                <Spin />
                            </div>
                        ) : (
                            <div className="flex items-center justify-between">
                                <div className="flex flex-col gap-2">
                                    <span className="text-xs font-semibold uppercase text-gray-400 dark:text-zinc-500">
                                        {selectedStatDetails.label}
                                    </span>
                                    <span className="text-3xl font-extrabold tracking-tight">
                                        {selectedStatDetails.value}
                                    </span>
                                </div>
                                <div className={`rounded-xl p-4 ${selectedStatDetails.bgClass} ${selectedStatDetails.colorClass}`}>
                                    <IconComponent size={28} />
                                </div>
                            </div>
                        )}
                    </div>
                </Col>

                <Col xs={24} md={18}>
                    {isFetchingTimeline ? (
                        <div className="flex h-[320px] items-center justify-center">
                            <Spin size="large" />
                        </div>
                    ) : activeData.items.length === 0 ? (
                        <div className="flex h-[320px] items-center justify-center">
                            <Empty description={messages('common.noDataAvailable')} />
                        </div>
                    ) : (
                        <BarView
                            barData={activeData.barData}
                            allDspKeys={allKeys}
                            colorMap={colorMap}
                            chartHeight={320}
                            tooltipHeaders={tooltipHeaders}
                            tooltipContent={tooltipComponent}
                            yAxisFormatter={yAxisFormatter}
                        />
                    )}
                </Col>
            </Row>
        </Card>
    );
}
