import { useQuery } from '@tanstack/react-query';
import { analytics2Apis } from '../apis';
import { analytics2QueryKeys } from '../constants/query-keys';
import { RevenueQueryParams, RevenueTimelineData } from '../types';

export const useGetReleaseRevenueTimeline = (
    releaseId: string,
    params: RevenueQueryParams,
    enabled: boolean = true
) => {
    const { data, ...res } = useQuery({
        queryKey: analytics2QueryKeys.releaseRevenueTimeline(releaseId, params),
        queryFn: () => analytics2Apis.getReleaseRevenueTimeline(releaseId, params),
        placeholderData: (prev) => prev,
        enabled: enabled && !!releaseId,
    });

    return {
        timelineData: data?.data?.data ?? ({} as RevenueTimelineData),
        ...res,
    };
};
