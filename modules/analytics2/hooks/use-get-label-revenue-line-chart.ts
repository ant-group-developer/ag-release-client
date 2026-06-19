import { useQuery } from '@tanstack/react-query';
import { analytics2Apis } from '../apis';
import { analytics2QueryKeys } from '../constants/query-keys';
import { RevenueLineChartItem, RevenueLineChartParams } from '../types';

export const useGetLabelRevenueLineChart = (
    labelId: string,
    params: RevenueLineChartParams,
    enabled: boolean = true
) => {
    const { data, ...res } = useQuery({
        queryKey: analytics2QueryKeys.labelRevenueLineChart(labelId, params),
        queryFn: () => analytics2Apis.getLabelRevenueLineChart(labelId, params),
        placeholderData: (prev) => prev,
        enabled: enabled && !!labelId,
    });

    return {
        revenueLineChartData: data?.data?.data ?? ([] as RevenueLineChartItem[]),
        ...res,
    };
};
