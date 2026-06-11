import { useQuery } from '@tanstack/react-query';
import { analytics2Apis } from '../apis';
import { analytics2QueryKeys } from '../constants/query-keys';
import { DspSalesTimelineData, DspTimelineParams } from '../types';

export const useGetDspSalesTimeline = (params: DspTimelineParams) => {
    const { data, ...res } = useQuery({
        queryKey: analytics2QueryKeys.dspSalesTimeline(params),
        queryFn: () => analytics2Apis.getDspSalesTimeline(params),
        placeholderData: (prev) => prev,
    });

    return {
        timelineData: data?.data?.data ?? ({} as DspSalesTimelineData),
        ...res,
    };
};
