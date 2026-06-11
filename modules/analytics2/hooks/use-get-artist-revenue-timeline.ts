import { useQuery } from '@tanstack/react-query';
import { analytics2Apis } from '../apis';
import { analytics2QueryKeys } from '../constants/query-keys';
import { RevenueTimelineData, RevenueQueryParams } from '../types';

export const useGetArtistRevenueTimeline = (
    artistId: string,
    params: RevenueQueryParams,
    enabled: boolean = true
) => {
    const { data, ...res } = useQuery({
        queryKey: analytics2QueryKeys.artistRevenueTimeline(artistId, params),
        queryFn: () => analytics2Apis.getArtistRevenueTimeline(artistId, params),
        placeholderData: (prev) => prev,
        enabled: enabled && !!artistId,
    });

    return {
        timelineData: data?.data?.data ?? ({} as RevenueTimelineData),
        ...res,
    };
};
