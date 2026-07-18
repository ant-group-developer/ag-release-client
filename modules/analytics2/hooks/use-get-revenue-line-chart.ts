import { useQuery } from '@tanstack/react-query';
import { analytics2Apis } from '../apis';
import { analytics2QueryKeys } from '../constants/query-keys';
import { AnalyticsCommonParams, RevenueLineChartItem } from '../types';

export const useGetRevenueLineChart = (
    params: AnalyticsCommonParams,
    options?: { enabled?: boolean }
) => {
    const { data, ...res } = useQuery({
        queryKey: analytics2QueryKeys.revenueLineChart(params),
        queryFn: () => analytics2Apis.getRevenueLineChart(params),
        placeholderData: (prev) => prev,
        ...options,
    });

    return {
        revenueLineChartData:
            data?.data?.data ?? ([] as RevenueLineChartItem[]),
        ...res,
    };
};
