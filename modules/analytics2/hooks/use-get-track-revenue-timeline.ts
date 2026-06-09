import { useQuery } from '@tanstack/react-query';
import { analytics2Apis } from '../apis';
import { analytics2QueryKeys } from '../constants/query-keys';
import { RevenueTimelineData, RevenueQueryParams } from '../types';

export const useGetTrackRevenueTimeline = (
    isrc: string,
    params: RevenueQueryParams,
    enabled: boolean = true
) => {
    const { data, ...res } = useQuery({
        queryKey: analytics2QueryKeys.trackRevenueTimeline(isrc, params),
        queryFn: () => analytics2Apis.getTrackRevenueTimeline(isrc, params),
        placeholderData: (prev) => prev,
        enabled: enabled && !!isrc,
    });

    return {
        timelineData: data?.data?.data ?? ({} as RevenueTimelineData),
        ...res,
    };
};
