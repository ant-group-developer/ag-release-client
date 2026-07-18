import { DEFAULT_DATA_PAGINATION } from '@/constants/common';
import { useQuery } from '@tanstack/react-query';
import { analytics2Apis } from '../apis';
import { analytics2QueryKeys } from '../constants/query-keys';
import { AnalyticsCommonParams } from '../types';

export const useGetArtistTer = (
    artistId: string,
    params: AnalyticsCommonParams,
    options?: { enabled?: boolean }
) => {
    const query = useQuery({
        queryKey: analytics2QueryKeys.artistTer(artistId, params),
        queryFn: () => analytics2Apis.getArtistTer(artistId, params),
        placeholderData: (prev) => prev,
        ...options,
        enabled: (options?.enabled ?? true) && !!artistId,
    });

    const artistTerData = query.data?.data?.data ?? DEFAULT_DATA_PAGINATION;

    return {
        artistTerData,
        ...query,
    };
};
