import { useQuery } from '@tanstack/react-query';
import { analytics2Apis } from '../apis';
import { analytics2QueryKeys } from '../constants/query-keys';
import { RevenueTerBarChartItem, RevenueTerBarChartParams } from '../types';

export const useGetReleaseRevenueTerBarChart = (
    releaseId: string,
    params: RevenueTerBarChartParams,
    enabled: boolean = true
) => {
    const { data, ...res } = useQuery({
        queryKey: analytics2QueryKeys.releaseRevenueTerBarChart(releaseId, params),
        queryFn: () => analytics2Apis.getReleaseRevenueTerBarChart(releaseId, params),
        placeholderData: (prev) => prev,
        enabled: enabled && !!releaseId,
    });

    return {
        revenueTerBarChartData: data?.data?.data ?? ([] as RevenueTerBarChartItem[]),
        ...res,
    };
};
