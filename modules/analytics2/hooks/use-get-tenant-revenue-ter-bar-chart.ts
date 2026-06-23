import { useQuery } from '@tanstack/react-query';
import { analytics2Apis } from '../apis';
import { analytics2QueryKeys } from '../constants/query-keys';
import { RevenueTerBarChartItem, RevenueTerBarChartParams } from '../types';

export const useGetTenantRevenueTerBarChart = (
    tenantId: string,
    params: RevenueTerBarChartParams,
    enabled: boolean = true
) => {
    const { data, ...res } = useQuery({
        queryKey: analytics2QueryKeys.tenantRevenueTerBarChart(tenantId, params),
        queryFn: () => analytics2Apis.getTenantRevenueTerBarChart(tenantId, params),
        placeholderData: (prev) => prev,
        enabled: enabled && !!tenantId,
    });

    return {
        revenueTerBarChartData: data?.data?.data ?? ([] as RevenueTerBarChartItem[]),
        ...res,
    };
};
