import { useQuery } from '@tanstack/react-query';
import { analytics2Apis } from '../apis';
import { analytics2QueryKeys } from '../constants/query-keys';
import { TrendViewLineChartItem, TrendViewLineChartParams } from '../types';

export const useGetTrendViewLineChart = (
    params: TrendViewLineChartParams,
    options?: { enabled?: boolean }
) => {
    const { data, ...res } = useQuery({
        queryKey: analytics2QueryKeys.trendViewLineChart(params),
        queryFn: () => analytics2Apis.getTrendViewLineChart(params),
        placeholderData: (prev) => prev,
        ...options,
    });

    return {
        lineChartData: data?.data?.data ?? ([] as TrendViewLineChartItem[]),
        ...res,
    };
};
