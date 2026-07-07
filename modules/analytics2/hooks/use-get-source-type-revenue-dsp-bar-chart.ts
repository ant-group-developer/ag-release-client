import { useQuery } from '@tanstack/react-query';
import { analytics2Apis } from '../apis';
import { analytics2QueryKeys } from '../constants/query-keys';
import { RevenueDspBarChartItem, RevenueDspBarChartParams } from '../types';

export const useGetSourceTypeRevenueDspBarChart = (
    sourceType: string,
    params: RevenueDspBarChartParams,
    enabled: boolean = true
) => {
    const { data, ...res } = useQuery({
        queryKey: analytics2QueryKeys.sourceTypeRevenueDspBarChart(sourceType, params),
        queryFn: () => analytics2Apis.getSourceTypeRevenueDspBarChart(sourceType, params),
        placeholderData: (prev) => prev,
        enabled: enabled && !!sourceType,
    });

    return {
        revenueDspBarChartData: data?.data?.data ?? ([] as RevenueDspBarChartItem[]),
        ...res,
    };
};
