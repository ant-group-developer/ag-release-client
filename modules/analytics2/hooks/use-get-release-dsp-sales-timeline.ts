import { useQuery } from '@tanstack/react-query';
import { analytics2Apis } from '../apis';
import { analytics2QueryKeys } from '../constants/query-keys';
import { DspSalesTimelineData, DspTimelineParams } from '../types';

export const useGetReleaseDspSalesTimeline = (
    releaseId: string,
    params: DspTimelineParams,
    enabled: boolean = true
) => {
    const { data, ...res } = useQuery({
        queryKey: analytics2QueryKeys.releaseDspSalesTimeline(releaseId, params),
        queryFn: () => analytics2Apis.getReleaseDspSalesTimeline(releaseId, params),
        placeholderData: (prev) => prev,
        enabled: enabled && !!releaseId,
    });

    return {
        timelineData: data?.data?.data ?? ({} as DspSalesTimelineData),
        ...res,
    };
};
