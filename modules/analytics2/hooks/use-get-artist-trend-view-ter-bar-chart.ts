import { useQuery } from '@tanstack/react-query';
import { analytics2Apis } from '../apis';
import { analytics2QueryKeys } from '../constants/query-keys';
import { TrendViewTerBarChartItem, TrendViewTerBarChartParams } from '../types';

export const useGetArtistTrendViewTerBarChart = (
    artistId: string,
    params: TrendViewTerBarChartParams,
    enabled: boolean = true
) => {
    const { data, ...res } = useQuery({
        queryKey: analytics2QueryKeys.artistTrendViewTerBarChart(artistId, params),
        queryFn: () => analytics2Apis.getArtistTrendViewTerBarChart(artistId, params),
        placeholderData: (prev) => prev,
        enabled: enabled && !!artistId,
    });

    return {
        terBarChartData: data?.data?.data ?? ([] as TrendViewTerBarChartItem[]),
        ...res,
    };
};
