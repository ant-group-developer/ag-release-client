import { DEFAULT_DATA_PAGINATION } from '@/constants/common';
import { useQuery } from '@tanstack/react-query';
import { analytics2Apis } from '../apis';
import { analytics2QueryKeys } from '../constants/query-keys';
import { RankingParams } from '../types';

export const useGetArtistTopReleases = (
    artistId: string,
    params: RankingParams,
    options?: { enabled?: boolean }
) => {
    const query = useQuery({
        queryKey: analytics2QueryKeys.artistTopReleases(artistId, params),
        queryFn: () => analytics2Apis.getArtistTopReleases(artistId, params),
        placeholderData: (prev) => prev,
        ...options,
    });

    const artistTopReleasesData =
        query.data?.data?.data ?? DEFAULT_DATA_PAGINATION;

    return {
        artistTopReleasesData,
        ...query,
    };
};
