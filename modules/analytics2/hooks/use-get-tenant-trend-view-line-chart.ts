import { useQuery } from '@tanstack/react-query';
import { analytics2Apis } from '../apis';
import { analytics2QueryKeys } from '../constants/query-keys';
import { TrendViewLineChartItem, TrendViewLineChartParams } from '../types';

export const useGetTenantTrendViewLineChart = (
    tenantId: string,
    params: TrendViewLineChartParams,
    enabled: boolean = true
) => {
    const { data, ...res } = useQuery({
        queryKey: analytics2QueryKeys.tenantTrendViewLineChart(tenantId, params),
        queryFn: () => analytics2Apis.getTenantTrendViewLineChart(tenantId, params),
        placeholderData: (prev) => prev,
        enabled: enabled && !!tenantId,
    });

    return {
        lineChartData: data?.data?.data ?? ([] as TrendViewLineChartItem[]),
        ...res,
    };
};
