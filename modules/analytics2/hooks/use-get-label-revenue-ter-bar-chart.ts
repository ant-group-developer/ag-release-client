import { useQuery } from '@tanstack/react-query';
import { analytics2Apis } from '../apis';
import { analytics2QueryKeys } from '../constants/query-keys';
import { RevenueTerBarChartItem, RevenueTerBarChartParams } from '../types';

export const useGetLabelRevenueTerBarChart = (
    labelId: string,
    params: RevenueTerBarChartParams,
    enabled: boolean = true
) => {
    const { data, ...res } = useQuery({
        queryKey: analytics2QueryKeys.labelRevenueTerBarChart(labelId, params),
        queryFn: () => analytics2Apis.getLabelRevenueTerBarChart(labelId, params),
        placeholderData: (prev) => prev,
        enabled: enabled && !!labelId,
    });

    return {
        revenueTerBarChartData: data?.data?.data ?? ([] as RevenueTerBarChartItem[]),
        ...res,
    };
};
