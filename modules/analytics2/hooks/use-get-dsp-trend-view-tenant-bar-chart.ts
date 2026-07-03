import { useQuery } from '@tanstack/react-query';
import { analytics2Apis } from '../apis';
import { analytics2QueryKeys } from '../constants/query-keys';
import { TrendViewTenantBarChartItem, DspDetailParams } from '../types';

export const useGetDspTrendViewTenantBarChart = (
    params: DspDetailParams,
    enabled: boolean = true
) => {
    const { data, ...res } = useQuery({
        queryKey: analytics2QueryKeys.dspTrendViewTenantBarChart(params),
        queryFn: () =>
            analytics2Apis.getDspTrendViewTenantBarChart({ ...params }),
        placeholderData: (prev) => prev,
        enabled: enabled && !!params.pgDspId && !!params.dspReportId,
    });

    return {
        tenantBarChartData: data?.data?.data ?? ([] as TrendViewTenantBarChartItem[]),
        ...res,
    };
};
