import { useQuery } from '@tanstack/react-query';
import { analytics2Apis } from '../apis';
import { analytics2QueryKeys } from '../constants/query-keys';
import { TrendViewTerBarChartItem, DspDetailParams } from '../types';

export const useGetDspTrendViewTerBarChart = (
    params: DspDetailParams,
    enabled: boolean = true
) => {
    const { data, ...res } = useQuery({
        queryKey: analytics2QueryKeys.dspTrendViewTerBarChart(params),
        queryFn: () =>
            analytics2Apis.getDspTrendViewTerBarChart({ ...params }),
        placeholderData: (prev) => prev,
        enabled: enabled && !!params.pgDspId && !!params.dspReportId,
    });

    return {
        terBarChartData: data?.data?.data ?? ([] as TrendViewTerBarChartItem[]),
        ...res,
    };
};
