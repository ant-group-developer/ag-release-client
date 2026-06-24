import { useQuery } from '@tanstack/react-query';
import { analytics2Apis } from '../apis';
import { analytics2QueryKeys } from '../constants/query-keys';
import { TrendViewLineChartItem, TrendViewLineChartParams } from '../types';

export const useGetTrackTrendViewLineChart = (
    isrc: string,
    params: TrendViewLineChartParams,
    enabled: boolean = true
) => {
    const { data, ...res } = useQuery({
        queryKey: analytics2QueryKeys.trackTrendViewLineChart(isrc, params),
        queryFn: () => analytics2Apis.getTrackTrendViewLineChart(isrc, params),
        placeholderData: (prev) => prev,
        enabled: enabled && !!isrc,
    });

    return {
        lineChartData: data?.data?.data ?? ([] as TrendViewLineChartItem[]),
        ...res,
    };
};
