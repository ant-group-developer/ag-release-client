import { useQuery } from '@tanstack/react-query';
import { analytics2Apis } from '../apis';
import { analytics2QueryKeys } from '../constants/query-keys';
import { DspSalesTimelineData, DspTimelineParams } from '../types';

export const useGetTrackDspSalesTimeline = (
    isrc: string,
    params: DspTimelineParams,
    enabled: boolean = true
) => {
    const { data, ...res } = useQuery({
        queryKey: analytics2QueryKeys.trackDspSalesTimeline(isrc, params),
        queryFn: () => analytics2Apis.getTrackDspSalesTimeline(isrc, params),
        placeholderData: (prev) => prev,
        enabled: enabled && !!isrc,
    });

    return {
        timelineData: data?.data?.data ?? ({} as DspSalesTimelineData),
        ...res,
    };
};
