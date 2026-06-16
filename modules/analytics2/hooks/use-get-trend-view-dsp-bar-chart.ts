import { useQuery } from '@tanstack/react-query';
import { analytics2Apis } from '../apis';
import { analytics2QueryKeys } from '../constants/query-keys';
import { TrendViewDspBarChartItem, TrendViewDspBarChartParams } from '../types';

export const useGetTrendViewDspBarChart = (
    params: TrendViewDspBarChartParams,
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
