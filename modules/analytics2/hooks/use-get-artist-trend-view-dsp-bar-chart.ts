import { useQuery } from '@tanstack/react-query';
import { analytics2Apis } from '../apis';
import { analytics2QueryKeys } from '../constants/query-keys';
import { TrendViewDspBarChartItem, TrendViewDspBarChartParams } from '../types';

export const useGetArtistTrendViewDspBarChart = (
    artistId: string,
    params: TrendViewDspBarChartParams,
    enabled: boolean = true
) => {
    const { data, ...res } = useQuery({
        queryKey: analytics2QueryKeys.artistTrendViewDspBarChart(artistId, params),
        queryFn: () => analytics2Apis.getArtistTrendViewDspBarChart(artistId, params),
        placeholderData: (prev) => prev,
        enabled: enabled && !!artistId,
    });

    return {
        dspBarChartData: data?.data?.data ?? ([] as TrendViewDspBarChartItem[]),
        ...res,
    };
};
