import { DEFAULT_DATA_PAGINATION } from '@/constants/common';
import { useQuery } from '@tanstack/react-query';
import { analytics2Apis } from '../apis';
import { analytics2QueryKeys } from '../constants/query-keys';
import { RankingParams } from '../types';

export const useGetSourceTypeTopTracks = (
    sourceType: string,
    params: RankingParams,
    options?: { enabled?: boolean }
) => {
    const query = useQuery({
        queryKey: analytics2QueryKeys.sourceTypeTopTracks(sourceType, params),
        queryFn: () => analytics2Apis.getSourceTypeTopTracks(sourceType, params),
        placeholderData: (prev) => prev,
        ...options,
    });

    const sourceTypeTopTracksData =
        query.data?.data?.data ?? DEFAULT_DATA_PAGINATION;

    return {
        sourceTypeTopTracksData,
        ...query,
    };
};
