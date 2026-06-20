import { useQuery } from '@tanstack/react-query';
import { analytics2Apis } from '../apis';
import { analytics2QueryKeys } from '../constants/query-keys';
import { RevenueDspBarChartItem, RevenueDspBarChartParams } from '../types';

export const useGetReleaseRevenueDspBarChart = (
    releaseId: string,
    params: RevenueDspBarChartParams,
    enabled: boolean = true
) => {
    const { data, ...res } = useQuery({
        queryKey: analytics2QueryKeys.releaseRevenueDspBarChart(releaseId, params),
        queryFn: () => analytics2Apis.getReleaseRevenueDspBarChart(releaseId, params),
        placeholderData: (prev) => prev,
        enabled: enabled && !!releaseId,
    });

    return {
        revenueDspBarChartData: data?.data?.data ?? ([] as RevenueDspBarChartItem[]),
        ...res,
    };
};
