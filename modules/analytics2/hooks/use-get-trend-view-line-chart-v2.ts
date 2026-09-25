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

const LINE_COLORS = [
    '#1890ff',
    '#52c41a',
    '#fa8c16',
    '#722ed1',
    '#eb2f96',
    '#13c2c2',
    '#f5222d',
    '#2f54eb',
];

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
            color: LINE_COLORS[index % LINE_COLORS.length],
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
