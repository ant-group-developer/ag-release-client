'use client';

import { SalesTooltip } from '@/components/shared/chart/chart-tooltip';
import { Card, Empty, Radio, Select, Skeleton } from 'antd';
import dayjs from 'dayjs';
import { useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';
import {
    ANALYTICS_CHART_PERIOD,
    ANALYTICS_CHART_VIEW_MODE,
} from '../../enums/tabs';
import {
    DSP_PALETTE,
    transformBarData,
    transformSalesBarData,
} from '../../helpers/analytics-chart-helper';
import { useGetDspDailyTimeline } from '../../hooks/use-get-dsp-daily-timeline';
import { useGetDspSalesTimeline } from '../../hooks/use-get-dsp-sales-timeline';
import { useGetDspTimeline } from '../../hooks/use-get-dsp-timeline';
import BarView from './bar-view';

interface Props {
    fromDate: string;
    toDate: string;
    chartHeight?: number;
}

export default function PlaysTimelineChart({
    fromDate,
    toDate,
    chartHeight,
}: Props) {
    const [chartPeriod, setChartPeriod] = useState<ANALYTICS_CHART_PERIOD>(
        ANALYTICS_CHART_PERIOD.MONTHLY
    );
    const [viewMode, setViewMode] = useState<ANALYTICS_CHART_VIEW_MODE>(
        ANALYTICS_CHART_VIEW_MODE.TRENDS
    );
    const [range, setRange] = useState<7 | 15 | 30>(7);
    const messages = useTranslations();

    // 1. Fetch Trends Timeline Data (Monthly)
    const { timelineData: trendData, isFetching: isFetchingTrends } =
        useGetDspTimeline({
            fromDate,
            toDate,
            topN: 5,
            includeOther: true,
        });

    // 2. Fetch Sales Timeline Data (Monthly)
    const { timelineData: salesData, isFetching: isFetchingSales } =
        useGetDspSalesTimeline({
            fromDate,
            toDate,
            topN: 5,
            includeOther: true,
        });

    // 3. Fetch Daily Timeline Data
    const toDateDaily = useMemo(() => dayjs().format('YYYY-MM-DD'), []);
    const fromDateDaily = useMemo(() => {
        return dayjs()
            .subtract(range - 1, 'day')
            .format('YYYY-MM-DD');
    }, [range]);

    const { timelineData: dailyData, isFetching: isFetchingDaily } =
        useGetDspDailyTimeline({
            fromDate: fromDateDaily,
            toDate: toDateDaily,
            topN: 5,
            includeOther: true,
        });

    const isFetching =
        chartPeriod === ANALYTICS_CHART_PERIOD.DAILY
            ? isFetchingDaily
            : viewMode === ANALYTICS_CHART_VIEW_MODE.TRENDS
              ? isFetchingTrends
              : isFetchingSales;

    // 4. Resolve active dataset based on viewMode (Monthly)
    const activeData = useMemo(() => {
        if (viewMode === ANALYTICS_CHART_VIEW_MODE.TRENDS) {
            const topDsps = trendData?.topDsps ?? [];
            const items = trendData?.items ?? [];
            const barData = transformBarData(items);
            return { topDsps, items, barData };
        } else {
            const topDsps = salesData?.topDsps ?? [];
            const items = salesData?.items ?? [];
            const barData = transformSalesBarData(items);
            return { topDsps, items, barData };
        }
    }, [viewMode, trendData, salesData]);

    const colorMap = useMemo(() => {
        const map: Record<string, string> = {};
        activeData.topDsps.forEach((dsp, i) => {
            map[dsp] = DSP_PALETTE[i % DSP_PALETTE.length];
        });
        map['Other'] = '#94a3b8';
        return map;
    }, [activeData.topDsps]);

    const allDspKeys = useMemo(() => {
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

    // 5. Resolve daily dataset logic
    const dailyTopDsps = useMemo(() => {
        return dailyData?.topDsps ?? [];
    }, [dailyData?.topDsps]);

    const dailyItems = useMemo(() => {
        return dailyData?.items ?? [];
    }, [dailyData?.items]);

    const dailyColorMap = useMemo(() => {
        const map: Record<string, string> = {};
        dailyTopDsps.forEach((dsp, i) => {
            map[dsp] = DSP_PALETTE[i % DSP_PALETTE.length];
        });
        map['Other'] = '#94a3b8';
        return map;
    }, [dailyTopDsps]);

    const dailyBarData = useMemo(
        () => transformBarData(dailyItems),
        [dailyItems]
    );

    const dailyAllDspKeys = useMemo(() => {
        const keys = new Set<string>();
        dailyItems.forEach((item) =>
            item.series.forEach(({ dsp }) => keys.add(dsp))
        );
        return Array.from(keys);
    }, [dailyItems]);

    return (
        <Card
            className="rounded-xl border-none shadow-sm"
            styles={{ body: { padding: '24px' } }}
        >
            <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Select
                        variant="borderless"
                        value={chartPeriod}
                        onChange={(val) => setChartPeriod(val)}
                        style={{
                            fontSize: 16,
                            fontWeight: 'bold',
                            width: 250,
                        }}
                        options={[
                            {
                                value: ANALYTICS_CHART_PERIOD.MONTHLY,
                                label: (
                                    <span
                                        style={{
                                            fontSize: 14,
                                            fontWeight: 'bold',
                                        }}
                                    >
                                        {messages('analytics.chart.title')}
                                    </span>
                                ),
                            },
                            {
                                value: ANALYTICS_CHART_PERIOD.DAILY,
                                label: (
                                    <span
                                        style={{
                                            fontSize: 14,
                                            fontWeight: 'bold',
                                        }}
                                    >
                                        {messages('analytics.dailyChart.title')}
                                    </span>
                                ),
                            },
                        ]}
                    />
                </div>
                {chartPeriod === ANALYTICS_CHART_PERIOD.MONTHLY ? (
                    <Radio.Group
                        value={viewMode}
                        onChange={(e) => setViewMode(e.target.value)}
                        buttonStyle="solid"
                    >
                        <Radio.Button
                            value={ANALYTICS_CHART_VIEW_MODE.TRENDS}
                            className="px-4 text-center"
                        >
                            {messages('analytics.chart.trends')}
                        </Radio.Button>
                        <Radio.Button
                            value={ANALYTICS_CHART_VIEW_MODE.SALES}
                            className="px-4 text-center"
                        >
                            {messages('analytics.chart.sales')}
                        </Radio.Button>
                    </Radio.Group>
                ) : (
                    <Select
                        value={range}
                        onChange={(val) => setRange(val)}
                        style={{ width: 160 }}
                        options={[
                            {
                                value: 7,
                                label: messages(
                                    'analytics.dailyChart.last7Days'
                                ),
                            },
                            {
                                value: 15,
                                label: messages(
                                    'analytics.dailyChart.last15Days'
                                ),
                            },
                            {
                                value: 30,
                                label: messages(
                                    'analytics.dailyChart.last30Days'
                                ),
                            },
                        ]}
                    />
                )}
            </div>

            {isFetching ? (
                <Skeleton active paragraph={{ rows: 8 }} />
            ) : chartPeriod === ANALYTICS_CHART_PERIOD.MONTHLY ? (
                activeData.items.length === 0 ? (
                    <Empty
                        className="py-12"
                        description={messages('common.noDataAvailable')}
                    />
                ) : (
                    <BarView
                        barData={activeData.barData}
                        allDspKeys={allDspKeys}
                        colorMap={colorMap}
                        chartHeight={chartHeight}
                        tooltipHeaders={[
                            messages('analytics.chart.dsp'),
                            messages('analytics.chart.view'),
                        ]}
                        tooltipContent={
                            viewMode === ANALYTICS_CHART_VIEW_MODE.SALES ? (
                                <SalesTooltip
                                    showTotal
                                    totalLabel={messages('common.total')}
                                />
                            ) : undefined
                        }
                        showTooltipTotal
                        tooltipTotalLabel={messages('common.total')}
                    />
                )
            ) : dailyItems.length === 0 ? (
                <Empty
                    className="py-12"
                    description={messages('common.noDataAvailable')}
                />
            ) : (
                <BarView
                    barData={dailyBarData}
                    allDspKeys={dailyAllDspKeys}
                    colorMap={dailyColorMap}
                    chartHeight={chartHeight}
                    tooltipHeaders={[
                        messages('analytics.chart.dsp'),
                        messages('analytics.chart.view'),
                    ]}
                    showTooltipTotal
                    tooltipTotalLabel={messages('common.total')}
                />
            )}
        </Card>
    );
}
