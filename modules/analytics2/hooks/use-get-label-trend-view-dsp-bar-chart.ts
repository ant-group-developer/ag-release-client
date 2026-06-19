import { useQuery } from '@tanstack/react-query';
import { analytics2Apis } from '../apis';
import { analytics2QueryKeys } from '../constants/query-keys';
import { TrendViewDspBarChartItem, TrendViewDspBarChartParams } from '../types';

export const useGetLabelTrendViewDspBarChart = (
    labelId: string,
    params: TrendViewDspBarChartParams,
    enabled: boolean = true
) => {
    const { data, ...res } = useQuery({
        queryKey: analytics2QueryKeys.labelTrendViewDspBarChart(labelId, params),
        queryFn: () => analytics2Apis.getLabelTrendViewDspBarChart(labelId, params),
        placeholderData: (prev) => prev,
        enabled: enabled && !!labelId,
    });

    return {
        dspBarChartData: data?.data?.data ?? ([] as TrendViewDspBarChartItem[]),
        ...res,
    };
};
