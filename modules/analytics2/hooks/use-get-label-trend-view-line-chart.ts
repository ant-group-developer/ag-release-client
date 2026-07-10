import { useQuery } from '@tanstack/react-query';
import { analytics2Apis } from '../apis';
import { analytics2QueryKeys } from '../constants/query-keys';
import { AnalyticsCommonParams, TrendViewLineChartItem } from '../types';

export const useGetLabelTrendViewLineChart = (
    labelId: string,
    params: AnalyticsCommonParams,
    enabled: boolean = true
) => {
    const { data, ...res } = useQuery({
        queryKey: analytics2QueryKeys.labelTrendViewLineChart(labelId, params),
        queryFn: () =>
            analytics2Apis.getLabelTrendViewLineChart(labelId, params),
        placeholderData: (prev) => prev,
        enabled: enabled && !!labelId,
    });

    return {
        lineChartData: data?.data?.data ?? ([] as TrendViewLineChartItem[]),
        ...res,
    };
};
