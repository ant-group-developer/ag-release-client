import { useQuery } from '@tanstack/react-query';
import { analytics2Apis } from '../apis';
import { analytics2QueryKeys } from '../constants/query-keys';
import { AnalyticsCommonParams, TrendViewTerBarChartItem } from '../types';

export const useGetTrendViewTerBarChart = (
    params: AnalyticsCommonParams,
    options?: { enabled?: boolean }
) => {
    const { data, ...res } = useQuery({
        queryKey: analytics2QueryKeys.trendViewTerBarChart(params),
        queryFn: () => analytics2Apis.getTrendViewTerBarChart(params),
        placeholderData: (prev) => prev,
        ...options,
    });

    return {
        barChartData: data?.data?.data ?? ([] as TrendViewTerBarChartItem[]),
        ...res,
    };
};
