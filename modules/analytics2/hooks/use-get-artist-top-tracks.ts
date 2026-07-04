import { DEFAULT_DATA_PAGINATION } from '@/constants/common';
import { useQuery } from '@tanstack/react-query';
import { analytics2Apis } from '../apis';
import { analytics2QueryKeys } from '../constants/query-keys';
import { RankingParams } from '../types';

export const useGetArtistTopTracks = (
    artistId: string,
    params: RankingParams,
    options?: { enabled?: boolean }
) => {
    const query = useQuery({
        queryKey: analytics2QueryKeys.artistTopTracks(artistId, params),
        queryFn: () => analytics2Apis.getArtistTopTracks(artistId, params),
        placeholderData: (prev) => prev,
        ...options,
    });

    const artistTopTracksData =
        query.data?.data?.data ?? DEFAULT_DATA_PAGINATION;

    return {
        artistTopTracksData,
        ...query,
    };
};
