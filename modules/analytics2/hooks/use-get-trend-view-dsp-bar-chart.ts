import { useQuery } from '@tanstack/react-query';
import { analytics2Apis } from '../apis';
import { analytics2QueryKeys } from '../constants/query-keys';
import { AnalyticsCommonParams, TrendViewDspBarChartItem } from '../types';

export const useGetTrendViewDspBarChart = (
    params: AnalyticsCommonParams,
    options?: { enabled?: boolean }
) => {
    const { data, ...res } = useQuery({
        queryKey: analytics2QueryKeys.trendViewDspBarChart(params),
        queryFn: () => analytics2Apis.getTrendViewDspBarChart(params),
        placeholderData: (prev) => prev,
        ...options,
    });

    return {
        barChartData: data?.data?.data ?? ([] as TrendViewDspBarChartItem[]),
        ...res,
    };
};
