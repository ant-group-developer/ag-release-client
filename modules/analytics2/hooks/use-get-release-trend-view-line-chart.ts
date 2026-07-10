import { useQuery } from '@tanstack/react-query';
import { analytics2Apis } from '../apis';
import { analytics2QueryKeys } from '../constants/query-keys';
import { AnalyticsCommonParams, TrendViewLineChartItem } from '../types';

export const useGetReleaseTrendViewLineChart = (
    releaseId: string,
    params: AnalyticsCommonParams,
    enabled: boolean = true
) => {
    const { data, ...res } = useQuery({
        queryKey: analytics2QueryKeys.releaseTrendViewLineChart(
            releaseId,
            params
        ),
        queryFn: () =>
            analytics2Apis.getReleaseTrendViewLineChart(releaseId, params),
        placeholderData: (prev) => prev,
        enabled: enabled && !!releaseId,
    });

    return {
        lineChartData: data?.data?.data ?? ([] as TrendViewLineChartItem[]),
        ...res,
    };
};
