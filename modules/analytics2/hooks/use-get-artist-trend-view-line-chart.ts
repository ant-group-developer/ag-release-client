import { useQuery } from '@tanstack/react-query';
import { analytics2Apis } from '../apis';
import { analytics2QueryKeys } from '../constants/query-keys';
import { TrendViewLineChartItem, TrendViewLineChartParams } from '../types';

export const useGetArtistTrendViewLineChart = (
    artistId: string,
    params: TrendViewLineChartParams,
    enabled: boolean = true
) => {
    const { data, ...res } = useQuery({
        queryKey: analytics2QueryKeys.artistTrendViewLineChart(artistId, params),
        queryFn: () => analytics2Apis.getArtistTrendViewLineChart(artistId, params),
        placeholderData: (prev) => prev,
        enabled: enabled && !!artistId,
    });

    return {
        lineChartData: data?.data?.data ?? ([] as TrendViewLineChartItem[]),
        ...res,
    };
};
