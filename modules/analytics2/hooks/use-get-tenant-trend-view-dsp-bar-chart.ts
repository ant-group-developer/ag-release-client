import { useQuery } from '@tanstack/react-query';
import { analytics2Apis } from '../apis';
import { analytics2QueryKeys } from '../constants/query-keys';
import { TrendViewDspBarChartItem, TrendViewDspBarChartParams } from '../types';

export const useGetTenantTrendViewDspBarChart = (
    tenantId: string,
    params: TrendViewDspBarChartParams,
    enabled: boolean = true
) => {
    const { data, ...res } = useQuery({
        queryKey: analytics2QueryKeys.tenantTrendViewDspBarChart(tenantId, params),
        queryFn: () => analytics2Apis.getTenantTrendViewDspBarChart(tenantId, params),
        placeholderData: (prev) => prev,
        enabled: enabled && !!tenantId,
    });

    return {
        dspBarChartData: data?.data?.data ?? ([] as TrendViewDspBarChartItem[]),
        ...res,
    };
};
