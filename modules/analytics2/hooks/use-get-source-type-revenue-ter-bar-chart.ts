import { useQuery } from '@tanstack/react-query';
import { analytics2Apis } from '../apis';
import { analytics2QueryKeys } from '../constants/query-keys';
import { AnalyticsCommonParams, RevenueTerBarChartItem } from '../types';

export const useGetSourceTypeRevenueTerBarChart = (
    sourceType: string,
    params: AnalyticsCommonParams,
    enabled: boolean = true
) => {
    const { data, ...res } = useQuery({
        queryKey: analytics2QueryKeys.sourceTypeRevenueTerBarChart(
            sourceType,
            params
        ),
        queryFn: () =>
            analytics2Apis.getSourceTypeRevenueTerBarChart(sourceType, params),
        placeholderData: (prev) => prev,
        enabled: enabled && !!sourceType,
    });

    return {
        revenueTerBarChartData:
            data?.data?.data ?? ([] as RevenueTerBarChartItem[]),
        ...res,
    };
};
