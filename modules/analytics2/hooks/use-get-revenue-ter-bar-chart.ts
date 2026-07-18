import { useQuery } from '@tanstack/react-query';
import { analytics2Apis } from '../apis';
import { analytics2QueryKeys } from '../constants/query-keys';
import { AnalyticsCommonParams, RevenueTerBarChartItem } from '../types';

export const useGetRevenueTerBarChart = (
    params: AnalyticsCommonParams,
    options?: { enabled?: boolean }
) => {
    const { data, ...res } = useQuery({
        queryKey: analytics2QueryKeys.revenueTerBarChart(params),
        queryFn: () => analytics2Apis.getRevenueTerBarChart(params),
        placeholderData: (prev) => prev,
        ...options,
    });

    return {
        revenueTerBarChartData:
            data?.data?.data ?? ([] as RevenueTerBarChartItem[]),
        ...res,
    };
};
