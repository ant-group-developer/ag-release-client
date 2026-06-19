import { useQuery } from '@tanstack/react-query';
import { analytics2Apis } from '../apis';
import { analytics2QueryKeys } from '../constants/query-keys';
import { TrendViewTerBarChartItem, TrendViewTerBarChartParams } from '../types';

export const useGetLabelTrendViewTerBarChart = (
    labelId: string,
    params: TrendViewTerBarChartParams,
    enabled: boolean = true
) => {
    const { data, ...res } = useQuery({
        queryKey: analytics2QueryKeys.labelTrendViewTerBarChart(labelId, params),
        queryFn: () => analytics2Apis.getLabelTrendViewTerBarChart(labelId, params),
        placeholderData: (prev) => prev,
        enabled: enabled && !!labelId,
    });

    return {
        terBarChartData: data?.data?.data ?? ([] as TrendViewTerBarChartItem[]),
        ...res,
    };
};
