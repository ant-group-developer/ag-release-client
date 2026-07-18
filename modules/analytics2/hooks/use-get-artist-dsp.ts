import { DEFAULT_DATA_PAGINATION } from '@/constants/common';
import { useQuery } from '@tanstack/react-query';
import { analytics2Apis } from '../apis';
import { analytics2QueryKeys } from '../constants/query-keys';
import { AnalyticsCommonParams } from '../types';

export const useGetArtistDsp = (
    artistId: string,
    params: AnalyticsCommonParams,
    options?: { enabled?: boolean }
) => {
    const query = useQuery({
        queryKey: analytics2QueryKeys.artistDsp(artistId, params),
        queryFn: () => analytics2Apis.getArtistDsp(artistId, params),
        placeholderData: (prev) => prev,
        ...options,
        enabled: (options?.enabled ?? true) && !!artistId,
    });

    const artistDspData = query.data?.data?.data ?? DEFAULT_DATA_PAGINATION;

    return {
        artistDspData,
        ...query,
    };
};
