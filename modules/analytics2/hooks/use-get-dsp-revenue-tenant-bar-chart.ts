import { useQuery } from '@tanstack/react-query';
import { analytics2Apis } from '../apis';
import { analytics2QueryKeys } from '../constants/query-keys';
import { RevenueTenantBarChartItem, DspDetailParams } from '../types';

export const useGetDspRevenueTenantBarChart = (
    params: DspDetailParams,
    enabled: boolean = true
) => {
    const { data, ...res } = useQuery({
        queryKey: analytics2QueryKeys.dspRevenueTenantBarChart(params),
        queryFn: () =>
            analytics2Apis.getDspRevenueTenantBarChart({ ...params }),
        placeholderData: (prev) => prev,
        enabled: enabled && !!params.pgDspId && !!params.dspReportId,
    });

    return {
        tenantBarChartData: data?.data?.data ?? ([] as RevenueTenantBarChartItem[]),
        ...res,
    };
};
