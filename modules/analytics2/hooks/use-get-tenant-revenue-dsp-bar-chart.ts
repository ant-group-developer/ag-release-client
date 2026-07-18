import { useQuery } from '@tanstack/react-query';
import { analytics2Apis } from '../apis';
import { analytics2QueryKeys } from '../constants/query-keys';
import { RevenueDspBarChartItem, RevenueDspBarChartParams } from '../types';

export const useGetTenantRevenueDspBarChart = (
    tenantId: string,
    params: RevenueDspBarChartParams,
    enabled: boolean = true
) => {
    const { data, ...res } = useQuery({
        queryKey: analytics2QueryKeys.tenantRevenueDspBarChart(tenantId, params),
        queryFn: () => analytics2Apis.getTenantRevenueDspBarChart(tenantId, params),
        placeholderData: (prev) => prev,
        enabled: enabled && !!tenantId,
    });

    return {
        revenueDspBarChartData: data?.data?.data ?? ([] as RevenueDspBarChartItem[]),
        ...res,
    };
};
