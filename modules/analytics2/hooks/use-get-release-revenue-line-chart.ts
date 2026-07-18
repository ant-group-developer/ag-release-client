import { useQuery } from '@tanstack/react-query';
import { analytics2Apis } from '../apis';
import { analytics2QueryKeys } from '../constants/query-keys';
import { AnalyticsCommonParams, RevenueLineChartItem } from '../types';

export const useGetReleaseRevenueLineChart = (
    releaseId: string,
    params: AnalyticsCommonParams,
    enabled: boolean = true
) => {
    const { data, ...res } = useQuery({
        queryKey: analytics2QueryKeys.releaseRevenueLineChart(
            releaseId,
            params
        ),
        queryFn: () =>
            analytics2Apis.getReleaseRevenueLineChart(releaseId, params),
        placeholderData: (prev) => prev,
        enabled: enabled && !!releaseId,
    });

    return {
        revenueLineChartData:
            data?.data?.data ?? ([] as RevenueLineChartItem[]),
        ...res,
    };
};
