'use client';

import { SalesTooltip } from '@/components/shared/chart/chart-tooltip';
import { Card, Empty, Radio, Select, Skeleton } from 'antd';
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
import BarView from '../chart/bar-view';

interface DetailDspTimelineChartProps {
    trendTimelineData?: {
        topDsps: string[];
        items: any[];
    };
    isTrendFetching: boolean;
    salesTimelineData?: {
        topDsps: string[];
        items: any[];
    };
    isSalesFetching: boolean;
    dailyTimelineData?: {
        topDsps: string[];
        items: any[];
    };
    isDailyFetching: boolean;
    range: number;
    onRangeChange: (range: number) => void;
}

export default function DetailDspTimelineChart({
    trendTimelineData,
    isTrendFetching,
    salesTimelineData,
    isSalesFetching,
    dailyTimelineData,
    isDailyFetching,
    range,
    onRangeChange,
}: DetailDspTimelineChartProps) {
    const messages = useTranslations();

    const [chartPeriod, setChartPeriod] = useState<ANALYTICS_CHART_PERIOD>(
        ANALYTICS_CHART_PERIOD.MONTHLY
    );
    const [viewMode, setViewMode] = useState<ANALYTICS_CHART_VIEW_MODE>(
        ANALYTICS_CHART_VIEW_MODE.TRENDS
    );

    const isTimelineFetching =
        chartPeriod === ANALYTICS_CHART_PERIOD.MONTHLY
            ? viewMode === ANALYTICS_CHART_VIEW_MODE.TRENDS
                ? isTrendFetching
                : isSalesFetching
            : isDailyFetching;

    const activeData = useMemo(() => {
        if (chartPeriod === ANALYTICS_CHART_PERIOD.MONTHLY) {
            if (viewMode === ANALYTICS_CHART_VIEW_MODE.TRENDS) {
                const topDsps = trendTimelineData?.topDsps ?? [];
                const items = trendTimelineData?.items ?? [];
                const barData = transformBarData(items);
                return { topDsps, items, barData };
            } else {
                const topDsps = salesTimelineData?.topDsps ?? [];
                const items = salesTimelineData?.items ?? [];
                const barData = transformSalesBarData(items);
                return { topDsps, items, barData };
            }
        } else {
            const topDsps = dailyTimelineData?.topDsps ?? [];
            const items = dailyTimelineData?.items ?? [];
            const barData = transformBarData(items);
            return { topDsps, items, barData };
        }
    }, [
        chartPeriod,
        viewMode,
        trendTimelineData,
        salesTimelineData,
        dailyTimelineData,
    ]);

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

    return (
        <Card
            title={
                <div className="flex items-center gap-3">
                    <Select
                        variant="borderless"
                        value={chartPeriod}
                        onChange={(val) => setChartPeriod(val)}
                        style={{
                            fontSize: 16,
                            fontWeight: 'bold',
                            width: 250,
                            padding: 0,
                        }}
                        // dropdownStyle={{ minWidth: 150 }}
                        // styles={{
                        //     popup: {
                        //         root: {
                        //             minWidth: 150,
                        //         },
                        //     },
                        // }}
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
            }
            extra={
                chartPeriod === ANALYTICS_CHART_PERIOD.MONTHLY ? (
                    <Radio.Group
                        value={viewMode}
                        onChange={(e) => setViewMode(e.target.value)}
                        optionType="button"
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
                        onChange={(val) => onRangeChange(val)}
                        style={{ width: 160, fontWeight: 'bold' }}
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
                )
            }
            className="h-full w-full rounded-xl border-none shadow-sm"
            styles={{ body: { padding: '24px' } }}
        >
            {isTimelineFetching ? (
                <Skeleton active paragraph={{ rows: 8 }} />
            ) : activeData.items.length === 0 ? (
                <Empty
                    className="py-12"
                    description={messages('common.noDataAvailable')}
                />
            ) : (
                <BarView
                    barData={activeData.barData}
                    allDspKeys={allDspKeys}
                    colorMap={colorMap}
                    tooltipHeaders={[
                        messages('analytics.chart.dsp'),
                        messages('analytics.chart.view'),
                    ]}
                    tooltipContent={
                        chartPeriod === ANALYTICS_CHART_PERIOD.MONTHLY &&
                        viewMode === ANALYTICS_CHART_VIEW_MODE.SALES ? (
                            <SalesTooltip />
                        ) : undefined
                    }
                />
            )}
        </Card>
    );
}
