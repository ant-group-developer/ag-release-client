import { useQuery } from '@tanstack/react-query';
import { analytics2Apis } from '../apis';
import { analytics2QueryKeys } from '../constants/query-keys';
import { RevenueLineChartItem, RevenueLineChartParams } from '../types';

export const useGetTenantRevenueLineChart = (
    tenantId: string,
    params: RevenueLineChartParams,
    enabled: boolean = true
) => {
    const { data, ...res } = useQuery({
        queryKey: analytics2QueryKeys.tenantRevenueLineChart(tenantId, params),
        queryFn: () => analytics2Apis.getTenantRevenueLineChart(tenantId, params),
        placeholderData: (prev) => prev,
        enabled: enabled && !!tenantId,
    });

    return {
        revenueLineChartData: data?.data?.data ?? ([] as RevenueLineChartItem[]),
        ...res,
    };
};
