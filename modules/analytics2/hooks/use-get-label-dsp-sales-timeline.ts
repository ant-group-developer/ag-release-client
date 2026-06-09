import { useQuery } from '@tanstack/react-query';
import { analytics2Apis } from '../apis';
import { analytics2QueryKeys } from '../constants/query-keys';
import { DspSalesTimelineData, DspTimelineParams } from '../types';

export const useGetLabelDspSalesTimeline = (
    labelId: string,
    params: DspTimelineParams,
    enabled: boolean = true
) => {
    const { data, ...res } = useQuery({
        queryKey: analytics2QueryKeys.labelDspSalesTimeline(labelId, params),
        queryFn: () => analytics2Apis.getLabelDspSalesTimeline(labelId, params),
        placeholderData: (prev) => prev,
        enabled: enabled && !!labelId,
    });

    return {
        timelineData: data?.data?.data ?? ({} as DspSalesTimelineData),
        ...res,
    };
};
