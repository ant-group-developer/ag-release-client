import { useQuery } from '@tanstack/react-query';
import { analytics2Apis } from '../apis';
import { analytics2QueryKeys } from '../constants/query-keys';
import { DspTimelineData, DspTimelineParams } from '../types';

export const useGetArtistDspDailyTimeline = (
    artistId: string,
    params: DspTimelineParams,
    enabled: boolean = true
) => {
    const { data, ...res } = useQuery({
        queryKey: analytics2QueryKeys.artistDspDailyTimeline(artistId, params),
        queryFn: () => analytics2Apis.getArtistDspDailyTimeline(artistId, params),
        placeholderData: (prev) => prev,
        enabled: enabled && !!artistId,
    });

    return {
        timelineData: data?.data?.data ?? ({} as DspTimelineData),
        ...res,
    };
};
