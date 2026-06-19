import { useQuery } from '@tanstack/react-query';
import { analytics2Apis } from '../apis';
import { analytics2QueryKeys } from '../constants/query-keys';
import { TrendViewDspBarChartItem, TrendViewDspBarChartParams } from '../types';

export const useGetReleaseTrendViewDspBarChart = (
    releaseId: string,
    params: TrendViewDspBarChartParams,
    enabled: boolean = true
) => {
    const { data, ...res } = useQuery({
        queryKey: analytics2QueryKeys.releaseTrendViewDspBarChart(releaseId, params),
        queryFn: () => analytics2Apis.getReleaseTrendViewDspBarChart(releaseId, params),
        placeholderData: (prev) => prev,
        enabled: enabled && !!releaseId,
    });

    return {
        dspBarChartData: data?.data?.data ?? ([] as TrendViewDspBarChartItem[]),
        ...res,
    };
};
