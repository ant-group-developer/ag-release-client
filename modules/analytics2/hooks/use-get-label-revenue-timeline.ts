import { useQuery } from '@tanstack/react-query';
import { analytics2Apis } from '../apis';
import { analytics2QueryKeys } from '../constants/query-keys';
import { RevenueTimelineData, RevenueQueryParams } from '../types';

export const useGetLabelRevenueTimeline = (
    labelId: string,
    params: RevenueQueryParams,
    enabled: boolean = true
) => {
    const { data, ...res } = useQuery({
        queryKey: analytics2QueryKeys.labelRevenueTimeline(labelId, params),
        queryFn: () => analytics2Apis.getLabelRevenueTimeline(labelId, params),
        placeholderData: (prev) => prev,
        enabled: enabled && !!labelId,
    });

    return {
        timelineData: data?.data?.data ?? ({} as RevenueTimelineData),
        ...res,
    };
};
