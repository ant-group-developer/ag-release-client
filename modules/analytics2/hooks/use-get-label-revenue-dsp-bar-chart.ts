import { useQuery } from '@tanstack/react-query';
import { analytics2Apis } from '../apis';
import { analytics2QueryKeys } from '../constants/query-keys';
import { RevenueDspBarChartItem, RevenueDspBarChartParams } from '../types';

export const useGetLabelRevenueDspBarChart = (
    labelId: string,
    params: RevenueDspBarChartParams,
    enabled: boolean = true
) => {
    const { data, ...res } = useQuery({
        queryKey: analytics2QueryKeys.labelRevenueDspBarChart(labelId, params),
        queryFn: () => analytics2Apis.getLabelRevenueDspBarChart(labelId, params),
        placeholderData: (prev) => prev,
        enabled: enabled && !!labelId,
    });

    return {
        revenueDspBarChartData: data?.data?.data ?? ([] as RevenueDspBarChartItem[]),
        ...res,
    };
};
