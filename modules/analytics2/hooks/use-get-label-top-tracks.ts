import { DEFAULT_DATA_PAGINATION } from '@/constants/common';
import { useQuery } from '@tanstack/react-query';
import { analytics2Apis } from '../apis';
import { analytics2QueryKeys } from '../constants/query-keys';
import { RankingParams } from '../types';

export const useGetLabelTopTracks = (
    labelId: string,
    params: RankingParams,
    options?: { enabled?: boolean }
) => {
    const query = useQuery({
        queryKey: analytics2QueryKeys.labelTopTracks(labelId, params),
        queryFn: () => analytics2Apis.getLabelTopTracks(labelId, params),
        placeholderData: (prev) => prev,
        ...options,
    });

    const labelTopTracksData =
        query.data?.data?.data ?? DEFAULT_DATA_PAGINATION;

    return {
        labelTopTracksData,
        ...query,
    };
};
