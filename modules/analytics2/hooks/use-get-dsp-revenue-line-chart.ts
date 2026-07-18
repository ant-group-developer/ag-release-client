import { useQuery } from '@tanstack/react-query';
import { analytics2Apis } from '../apis';
import { analytics2QueryKeys } from '../constants/query-keys';
import { RevenueLineChartItem, DspDetailParams } from '../types';

export const useGetDspRevenueLineChart = (
    params: DspDetailParams,
    enabled: boolean = true
) => {
    const { data, ...res } = useQuery({
        queryKey: analytics2QueryKeys.dspRevenueLineChart(params),
        queryFn: () =>
            analytics2Apis.getDspRevenueLineChart({ ...params }),
        placeholderData: (prev) => prev,
        enabled: enabled && !!params.pgDspId && !!params.dspReportId,
    });

    return {
        lineChartData: data?.data?.data ?? ([] as RevenueLineChartItem[]),
        ...res,
    };
};
