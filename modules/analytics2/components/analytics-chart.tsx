'use client';

import { Card, Empty, Radio, Skeleton } from 'antd';
import { useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';
import { useGetDspTimeline } from '../hooks/use-get-dsp-timeline';
import BarView from './bar-view';
import PieView from './pie-view';
import { DSP_PALETTE, transformBarData, useDspPieData } from '../helpers/analytics-chart-helper';

interface Props {
    fromDate: string;
    toDate: string;
}

export default function AnalyticsChart({ fromDate, toDate }: Props) {
    const [view, setView] = useState<'bar' | 'pie'>('bar');
    const messages = useTranslations();

    const { timelineData, isFetching } = useGetDspTimeline({
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
    const pieData = useDspPieData(items, topDsps, colorMap);

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
                        {messages('analytics.chart.title')}
                    </span>
                </div>
                <Radio.Group
                    value={view}
                    onChange={(e) => setView(e.target.value)}
                    buttonStyle="solid"
                >
                    <Radio.Button value="bar" className="w-16 text-center">
                        Bar
                    </Radio.Button>
                    <Radio.Button value="pie" className="w-16 text-center">
                        Pie
                    </Radio.Button>
                </Radio.Group>
            </div>

            {isFetching ? (
                <Skeleton active paragraph={{ rows: 8 }} />
            ) : items.length === 0 ? (
                <Empty className="py-12" description={messages('common.noDataAvailable')} />
            ) : (
                <>
                    {view === 'bar' && (
                        <BarView
                            barData={barData}
                            allDspKeys={allDspKeys}
                            colorMap={colorMap}
                        />
                    )}

                    {view === 'pie' && <PieView pieData={pieData} />}
                </>
            )}
        </Card>
    );
}
