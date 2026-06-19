import { useQuery } from '@tanstack/react-query';
import { analytics2Apis } from '../apis';
import { analytics2QueryKeys } from '../constants/query-keys';
import { RevenueTerBarChartItem, RevenueTerBarChartParams } from '../types';

export const useGetTrackRevenueTerBarChart = (
    isrc: string,
    params: RevenueTerBarChartParams,
    enabled: boolean = true
) => {
    const { data, ...res } = useQuery({
        queryKey: analytics2QueryKeys.trackRevenueTerBarChart(isrc, params),
        queryFn: () => analytics2Apis.getTrackRevenueTerBarChart(isrc, params),
        placeholderData: (prev) => prev,
        enabled: enabled && !!isrc,
    });

    return {
        revenueTerBarChartData: data?.data?.data ?? ([] as RevenueTerBarChartItem[]),
        ...res,
    };
};
