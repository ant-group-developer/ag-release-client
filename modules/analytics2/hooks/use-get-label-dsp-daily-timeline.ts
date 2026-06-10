import { useQuery } from '@tanstack/react-query';
import { analytics2Apis } from '../apis';
import { analytics2QueryKeys } from '../constants/query-keys';
import { DspTimelineData, DspTimelineParams } from '../types';

export const useGetLabelDspDailyTimeline = (
    labelId: string,
    params: DspTimelineParams,
    enabled: boolean = true
) => {
    const { data, ...res } = useQuery({
        queryKey: analytics2QueryKeys.labelDspDailyTimeline(labelId, params),
        queryFn: () => analytics2Apis.getLabelDspDailyTimeline(labelId, params),
        placeholderData: (prev) => prev,
        enabled: enabled && !!labelId,
    });

    return {
        timelineData: data?.data?.data ?? ({} as DspTimelineData),
        ...res,
    };
};
