'use client';

import { Card, Empty, Select, Skeleton } from 'antd';
import dayjs from 'dayjs';
import { useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';
import { useGetDspDailyTimeline } from '../hooks/use-get-dsp-daily-timeline';
import BarView from './bar-view';
import { DSP_PALETTE, transformBarData } from '../helpers/analytics-chart-helper';

export default function AnalyticsDailyChart() {
    const messages = useTranslations();
    const [range, setRange] = useState<7 | 15 | 30>(7);

    // Calculate dynamic dates based on selected range
    const toDate = useMemo(() => dayjs().format('YYYY-MM-DD'), []);
    const fromDate = useMemo(() => {
        return dayjs().subtract(range - 1, 'day').format('YYYY-MM-DD');
    }, [range]);

    // Fetch daily trend stats
    const { timelineData, isFetching } = useGetDspDailyTimeline({
        fromDate,
        toDate,
        topN: 5,
        includeOther: true,
    });

    const topDsps = useMemo(() => {
        return timelineData?.topDsps ?? [];
    }, [timelineData?.topDsps]);

    const items = useMemo(() => {
        return timelineData?.items ?? [];
    }, [timelineData?.items]);

    const colorMap = useMemo(() => {
        const map: Record<string, string> = {};
        topDsps.forEach((dsp, i) => {
            map[dsp] = DSP_PALETTE[i % DSP_PALETTE.length];
        });
        map['Other'] = '#94a3b8';
        return map;
    }, [topDsps]);

    const barData = useMemo(() => transformBarData(items), [items]);

    const allDspKeys = useMemo(() => {
        const keys = new Set<string>();
        items.forEach((item) =>
            item.series.forEach(({ dsp }) => keys.add(dsp))
        );
        return Array.from(keys);
    }, [items]);

    return (
        <Card
            className="rounded-xl border-none shadow-sm"
            styles={{ body: { padding: '24px' } }}
        >
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <span className="text-base font-bold text-gray-800 dark:text-zinc-100">
                        {messages('analytics.dailyChart.title')}
                    </span>
                </div>
                <Select
                    value={range}
                    onChange={(val) => setRange(val)}
                    style={{ width: 160 }}
                    options={[
                        { value: 7, label: messages('analytics.dailyChart.last7Days') },
                        { value: 15, label: messages('analytics.dailyChart.last15Days') },
                        { value: 30, label: messages('analytics.dailyChart.last30Days') },
                    ]}
                />
            </div>

            {isFetching ? (
                <Skeleton active paragraph={{ rows: 8 }} />
            ) : items.length === 0 ? (
                <Empty className="py-12" description={messages('common.noDataAvailable')} />
            ) : (
                <BarView
                    barData={barData}
                    allDspKeys={allDspKeys}
                    colorMap={colorMap}
                />
            )}
        </Card>
    );
}
