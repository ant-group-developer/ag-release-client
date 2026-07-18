import { useQuery } from '@tanstack/react-query';
import { analytics2Apis } from '../apis';
import { analytics2QueryKeys } from '../constants/query-keys';
import { DspTimelineData, DspTimelineParams } from '../types';

export const useGetDspTimeline = (params: DspTimelineParams) => {
    const { data, ...res } = useQuery({
        queryKey: analytics2QueryKeys.dspTimeline(params),
        queryFn: () => analytics2Apis.getDspTimeline(params),
        placeholderData: (prev) => prev,
    });

    return {
        timelineData: data?.data?.data ?? ({} as DspTimelineData),
        ...res,
    };
};
