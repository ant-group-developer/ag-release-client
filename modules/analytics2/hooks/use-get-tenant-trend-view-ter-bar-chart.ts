import { useQuery } from '@tanstack/react-query';
import { analytics2Apis } from '../apis';
import { analytics2QueryKeys } from '../constants/query-keys';
import { TrendViewTerBarChartItem, TrendViewTerBarChartParams } from '../types';

export const useGetTenantTrendViewTerBarChart = (
    tenantId: string,
    params: TrendViewTerBarChartParams,
    enabled: boolean = true
) => {
    const { data, ...res } = useQuery({
        queryKey: analytics2QueryKeys.tenantTrendViewTerBarChart(tenantId, params),
        queryFn: () => analytics2Apis.getTenantTrendViewTerBarChart(tenantId, params),
        placeholderData: (prev) => prev,
        enabled: enabled && !!tenantId,
    });

    return {
        terBarChartData: data?.data?.data ?? ([] as TrendViewTerBarChartItem[]),
        ...res,
    };
};
