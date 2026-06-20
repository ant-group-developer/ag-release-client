import { useQuery } from '@tanstack/react-query';
import { analytics2Apis } from '../apis';
import { analytics2QueryKeys } from '../constants/query-keys';
import { TrendViewTerBarChartItem, TrendViewTerBarChartParams } from '../types';

export const useGetReleaseTrendViewTerBarChart = (
    releaseId: string,
    params: TrendViewTerBarChartParams,
    enabled: boolean = true
) => {
    const { data, ...res } = useQuery({
        queryKey: analytics2QueryKeys.releaseTrendViewTerBarChart(releaseId, params),
        queryFn: () => analytics2Apis.getReleaseTrendViewTerBarChart(releaseId, params),
        placeholderData: (prev) => prev,
        enabled: enabled && !!releaseId,
    });

    return {
        terBarChartData: data?.data?.data ?? ([] as TrendViewTerBarChartItem[]),
        ...res,
    };
};
