import { useQuery } from '@tanstack/react-query';
import { analytics2Apis } from '../apis';
import { analytics2QueryKeys } from '../constants/query-keys';
import { AnalyticsCommonParams, TrendViewLineChartItem } from '../types';

export const useGetSourceTypeTrendViewLineChart = (
    sourceType: string,
    params: AnalyticsCommonParams,
    enabled: boolean = true
) => {
    const { data, ...res } = useQuery({
        queryKey: analytics2QueryKeys.sourceTypeTrendViewLineChart(
            sourceType,
            params
        ),
        queryFn: () =>
            analytics2Apis.getSourceTypeTrendViewLineChart(sourceType, params),
        placeholderData: (prev) => prev,
        enabled: enabled && !!sourceType,
    });

    return {
        trendViewLineChartData:
            data?.data?.data ?? ([] as TrendViewLineChartItem[]),
        ...res,
    };
};
