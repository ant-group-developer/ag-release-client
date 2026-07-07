import { useQuery } from '@tanstack/react-query';
import { analytics2Apis } from '../apis';
import { analytics2QueryKeys } from '../constants/query-keys';
import { TrendViewTerBarChartItem, TrendViewTerBarChartParams } from '../types';

export const useGetSourceTypeTrendViewTerBarChart = (
    sourceType: string,
    params: TrendViewTerBarChartParams,
    enabled: boolean = true
) => {
    const { data, ...res } = useQuery({
        queryKey: analytics2QueryKeys.sourceTypeTrendViewTerBarChart(sourceType, params),
        queryFn: () => analytics2Apis.getSourceTypeTrendViewTerBarChart(sourceType, params),
        placeholderData: (prev) => prev,
        enabled: enabled && !!sourceType,
    });

    return {
        trendViewTerBarChartData: data?.data?.data ?? ([] as TrendViewTerBarChartItem[]),
        ...res,
    };
};
