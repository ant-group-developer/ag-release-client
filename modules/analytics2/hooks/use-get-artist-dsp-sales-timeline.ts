import { useQuery } from '@tanstack/react-query';
import { analytics2Apis } from '../apis';
import { analytics2QueryKeys } from '../constants/query-keys';
import { DspSalesTimelineData, DspTimelineParams } from '../types';

export const useGetArtistDspSalesTimeline = (
    artistId: string,
    params: DspTimelineParams,
    enabled: boolean = true
) => {
    const { data, ...res } = useQuery({
        queryKey: analytics2QueryKeys.artistDspSalesTimeline(artistId, params),
        queryFn: () => analytics2Apis.getArtistDspSalesTimeline(artistId, params),
        placeholderData: (prev) => prev,
        enabled: enabled && !!artistId,
    });

    return {
        timelineData: data?.data?.data ?? ({} as DspSalesTimelineData),
        ...res,
    };
};
