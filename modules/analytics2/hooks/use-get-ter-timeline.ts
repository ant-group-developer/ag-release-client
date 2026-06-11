import { useQuery } from '@tanstack/react-query';
import { analytics2Apis } from '../apis';
import { analytics2QueryKeys } from '../constants/query-keys';
import { TerTimelineData, TerTimelineParams } from '../types';

export const useGetTerTimeline = (params: TerTimelineParams) => {
    const { data, ...res } = useQuery({
        queryKey: analytics2QueryKeys.terTimeline(params),
        queryFn: () => analytics2Apis.getTerTimeline(params),
        placeholderData: (prev) => prev,
    });

    return {
        timelineData: data?.data?.data ?? ({} as TerTimelineData),
        ...res,
    };
};
