import { useQuery } from '@tanstack/react-query';
import { analytics2Apis } from '../apis';
import { analytics2QueryKeys } from '../constants/query-keys';
import { TrendViewTerBarChartItem, TrendViewTerBarChartParams } from '../types';

export const useGetTrackTrendViewTerBarChart = (
    isrc: string,
    params: TrendViewTerBarChartParams,
    enabled: boolean = true
) => {
    const { data, ...res } = useQuery({
        queryKey: analytics2QueryKeys.trackTrendViewTerBarChart(isrc, params),
        queryFn: () => analytics2Apis.getTrackTrendViewTerBarChart(isrc, params),
        placeholderData: (prev) => prev,
        enabled: enabled && !!isrc,
    });

    return {
        terBarChartData: data?.data?.data ?? ([] as TrendViewTerBarChartItem[]),
        ...res,
    };
};
