'use client';

import { Card, Empty, Radio, Skeleton } from 'antd';
import { useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';
import { useGetDspTimeline } from '../hooks/use-get-dsp-timeline';
import { useGetDspSalesTimeline } from '../hooks/use-get-dsp-sales-timeline';
import BarView from './bar-view';
import { DSP_PALETTE, transformBarData, transformSalesBarData } from '../helpers/analytics-chart-helper';

interface Props {
    fromDate: string;
    toDate: string;
}

export default function AnalyticsChart({ fromDate, toDate }: Props) {
    const [viewMode, setViewMode] = useState<'trends' | 'sales'>('trends');
    const messages = useTranslations();

    // 1. Fetch Trends Timeline Data
    const { timelineData: trendData, isFetching: isFetchingTrends } = useGetDspTimeline({
        fromDate,
        toDate,
        topN: 5,
        includeOther: true,
    });

    // 2. Fetch Sales Timeline Data
    const { timelineData: salesData, isFetching: isFetchingSales } = useGetDspSalesTimeline({
        fromDate,
        toDate,
        topN: 5,
        includeOther: true,
    });

    const isFetching = viewMode === 'trends' ? isFetchingTrends : isFetchingSales;

    // 3. Resolve active dataset based on viewMode
    const activeData = useMemo(() => {
        if (viewMode === 'trends') {
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
        activeData.items.forEach((item) =>
            item.series.forEach(({ dsp }) => keys.add(dsp))
        );
        return Array.from(keys);
    }, [activeData.items]);

    return (
        <Card
            className="rounded-xl border-none shadow-sm"
            styles={{ body: { padding: '24px' } }}
        >
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <span className="text-base font-bold text-gray-800 dark:text-zinc-100">
                        {messages('analytics.chart.title')}
                    </span>
                </div>
                <Radio.Group
                    value={viewMode}
                    onChange={(e) => setViewMode(e.target.value)}
                    buttonStyle="solid"
                >
                    <Radio.Button value="trends" className="px-4 text-center">
                        {messages('analytics.chart.trends')}
                    </Radio.Button>
                    <Radio.Button value="sales" className="px-4 text-center">
                        {messages('analytics.chart.sales')}
                    </Radio.Button>
                </Radio.Group>
            </div>

            {isFetching ? (
                <Skeleton active paragraph={{ rows: 8 }} />
            ) : activeData.items.length === 0 ? (
                <Empty className="py-12" description={messages('common.noDataAvailable')} />
            ) : (
                <BarView
                    barData={activeData.barData}
                    allDspKeys={allDspKeys}
                    colorMap={colorMap}
                />
            )}
        </Card>
    );
}
