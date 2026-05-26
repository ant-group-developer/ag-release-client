import { useMemo } from 'react';
import { TrendTimelinePeriod } from '../types';

export const DSP_PALETTE = [
    '#6366f1',
    '#06b6d4',
    '#f59e0b',
    '#10b981',
    '#f43f5e',
    '#8b5cf6',
    '#ec4899',
    '#14b8a6',
];

export function transformTrendBarData(items: TrendTimelinePeriod[]) {
    return items.map((item) => {
        const row: Record<string, any> = { period: item.period };
        item.series.forEach(({ dsp, trendViews }) => {
            row[dsp] = trendViews;
        });
        return row;
    });
}

export function useTrendPieData(
    items: TrendTimelinePeriod[],
    topDsps: string[],
    colorMap: Record<string, string>
) {
    return useMemo(() => {
        const totals: Record<string, number> = {};
        items.forEach((item) => {
            item.series.forEach(({ dsp, trendViews }) => {
                totals[dsp] = (totals[dsp] ?? 0) + trendViews;
            });
        });
        return [...topDsps, 'Other']
            .filter((dsp) => totals[dsp] !== undefined)
            .map((dsp) => ({
                name: dsp,
                value: totals[dsp],
                color: colorMap[dsp] ?? '#94a3b8',
            }));
    }, [items, topDsps, colorMap]);
}
