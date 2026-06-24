import { useQuery } from '@tanstack/react-query';
import { analytics2Apis } from '../apis';
import { analytics2QueryKeys } from '../constants/query-keys';
import { RevenueLineChartItem, RevenueLineChartParams } from '../types';

export const useGetArtistRevenueLineChart = (
    artistId: string,
    params: RevenueLineChartParams,
    enabled: boolean = true
) => {
    const { data, ...res } = useQuery({
        queryKey: analytics2QueryKeys.artistRevenueLineChart(artistId, params),
        queryFn: () => analytics2Apis.getArtistRevenueLineChart(artistId, params),
        placeholderData: (prev) => prev,
        enabled: enabled && !!artistId,
    });

    return {
        revenueLineChartData: data?.data?.data ?? ([] as RevenueLineChartItem[]),
        ...res,
    };
};
