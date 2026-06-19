import { useQuery } from '@tanstack/react-query';
import { analytics2Apis } from '../apis';
import { analytics2QueryKeys } from '../constants/query-keys';
import { RevenueTerBarChartItem, RevenueTerBarChartParams } from '../types';

export const useGetArtistRevenueTerBarChart = (
    artistId: string,
    params: RevenueTerBarChartParams,
    enabled: boolean = true
) => {
    const { data, ...res } = useQuery({
        queryKey: analytics2QueryKeys.artistRevenueTerBarChart(artistId, params),
        queryFn: () => analytics2Apis.getArtistRevenueTerBarChart(artistId, params),
        placeholderData: (prev) => prev,
        enabled: enabled && !!artistId,
    });

    return {
        revenueTerBarChartData: data?.data?.data ?? ([] as RevenueTerBarChartItem[]),
        ...res,
    };
};
