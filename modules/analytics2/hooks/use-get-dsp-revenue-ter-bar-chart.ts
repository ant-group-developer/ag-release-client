import { useQuery } from '@tanstack/react-query';
import { analytics2Apis } from '../apis';
import { analytics2QueryKeys } from '../constants/query-keys';
import { RevenueTerBarChartItem, DspDetailParams } from '../types';

export const useGetDspRevenueTerBarChart = (
    params: DspDetailParams,
    enabled: boolean = true
) => {
    const { data, ...res } = useQuery({
        queryKey: analytics2QueryKeys.dspRevenueTerBarChart(params),
        queryFn: () =>
            analytics2Apis.getDspRevenueTerBarChart({ ...params }),
        placeholderData: (prev) => prev,
        enabled: enabled && !!params.pgDspId && !!params.dspReportId,
    });

    return {
        terBarChartData: data?.data?.data ?? ([] as RevenueTerBarChartItem[]),
        ...res,
    };
};
