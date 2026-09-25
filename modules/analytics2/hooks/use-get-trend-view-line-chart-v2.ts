import { useQuery } from '@tanstack/react-query';
import { analytics2Apis } from '../apis';
import { analytics2QueryKeys } from '../constants/query-keys';
import {
    TrendViewLineChartV2Params,
    TrendViewLineChartV2Series,
    TrendViewLineChartV2SeriesValue,
} from '../types';

export interface TrendViewLineChartLine {
    key: string;
    name: string;
    color: string;
    imageUrl?: string;
}

export interface TrendViewLineChartRow {
    period: string;
    [key: string]: string | number;
}

export const LINE_COLORS = [
    '#1890ff', // Blue
    '#52c41a', // Green
    '#fa8c16', // Orange
    '#722ed1', // Purple
    '#eb2f96', // Magenta
    '#13c2c2', // Cyan
    '#f5222d', // Red
    '#2f54eb', // Geek Blue
    '#faad14', // Gold
    '#a0d911', // Lime
    '#13c296', // Teal / Emerald
    '#eb2f63', // Rose Red
    '#08979c', // Dark Cyan
    '#d4380d', // Volcano
    '#c41d7f', // Dark Magenta
    '#531dab', // Dark Purple
    '#096dd9', // Deep Daybreak Blue
    '#389e0d', // Forest Green
    '#d48806', // Golden Sun
    '#7cb305', // Moss Green
    '#0050b3', // Navy Blue
    '#ad2102', // Rust Red
    '#9254de', // Lavender
    '#ff85c0', // Soft Pink
];

export const getSeriesColor = (index: number): string => {
    if (index < LINE_COLORS.length) {
        return LINE_COLORS[index];
    }
    // Golden ratio hue angle to generate distinct contrast colors indefinitely
    const hue = Math.round((index * 137.508) % 360);
    return `hsl(${hue}, 75%, 50%)`;
};

const getSeriesKey = (
    series: TrendViewLineChartV2Series,
    index: number,
    usedKeys: Set<string>
) => {
    const baseKey = series.id || series.metadata?.id || 'series-' + index;
    let key = baseKey;
    let suffix = 1;

    while (usedKeys.has(key)) {
        key = baseKey + '-' + suffix;
        suffix += 1;
    }

    usedKeys.add(key);
    return key;
};

const getValue = (
    value: TrendViewLineChartV2SeriesValue,
    valueKey: keyof TrendViewLineChartV2SeriesValue
) => {
    const rawValue =
        value[valueKey] ??
        (valueKey === 'totalViews' ? value.quantity : undefined);
    return typeof rawValue === 'number' ? rawValue : Number(rawValue ?? 0);
};

export const mapTrendViewLineChartV2Series = (
    series: TrendViewLineChartV2Series[],
    valueKey: keyof TrendViewLineChartV2SeriesValue = 'totalViews'
) => {
    const usedKeys = new Set<string>();
    const lines: TrendViewLineChartLine[] = [];
    const rowsByPeriod = new Map<string, TrendViewLineChartRow>();

    series.forEach((item, index) => {
        const key = getSeriesKey(item, index, usedKeys);
        lines.push({
            key,
            name: item.metadata?.name || key,
            color: getSeriesColor(index),
            imageUrl: item.metadata?.imageUrl,
        });

        item.values?.forEach((value) => {
            const row =
                rowsByPeriod.get(value.period) ||
                rowsByPeriod
                    .set(value.period, { period: value.period })
                    .get(value.period)!;
            row[key] = getValue(value, valueKey);
        });
    });

    return {
        data: Array.from(rowsByPeriod.values()),
        lines,
    };
};

export const useGetTrendViewLineChartV2 = (
    params: TrendViewLineChartV2Params,
    options?: { enabled?: boolean }
) => {
    const { data, ...res } = useQuery({
        queryKey: analytics2QueryKeys.trendViewLineChartV2(params),
        queryFn: () => analytics2Apis.getTrendViewLineChartV2(params),
        placeholderData: (prev) => prev,
        ...options,
    });

    return {
        lineChartSeries: data?.data?.data?.series ?? [],
        seriesBy: data?.data?.data?.seriesBy,
        ...res,
    };
};
