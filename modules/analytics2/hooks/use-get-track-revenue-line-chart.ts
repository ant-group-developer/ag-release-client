import { useQuery } from '@tanstack/react-query';
import { analytics2Apis } from '../apis';
import { analytics2QueryKeys } from '../constants/query-keys';
import { RevenueLineChartItem, RevenueLineChartParams } from '../types';

export const useGetTrackRevenueLineChart = (
    isrc: string,
    params: RevenueLineChartParams,
    enabled: boolean = true
) => {
    const { data, ...res } = useQuery({
        queryKey: analytics2QueryKeys.trackRevenueLineChart(isrc, params),
        queryFn: () => analytics2Apis.getTrackRevenueLineChart(isrc, params),
        placeholderData: (prev) => prev,
        enabled: enabled && !!isrc,
    });

    return {
        revenueLineChartData: data?.data?.data ?? ([] as RevenueLineChartItem[]),
        ...res,
    };
};
