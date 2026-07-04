import { DEFAULT_DATA_PAGINATION } from '@/constants/common';
import { useQuery } from '@tanstack/react-query';
import { analytics2Apis } from '../apis';
import { analytics2QueryKeys } from '../constants/query-keys';
import { DspRankingParams } from '../types';

export const useGetDspTopTracks = (
    params: DspRankingParams,
    options?: { enabled?: boolean }
) => {
    const query = useQuery({
        queryKey: analytics2QueryKeys.dspTopTracks(params),
        queryFn: () => analytics2Apis.getDspTopTracks(params),
        placeholderData: (prev) => prev,
        ...options,
    });

    const dspTopTracksData =
        query.data?.data?.data ?? DEFAULT_DATA_PAGINATION;

    return {
        dspTopTracksData,
        ...query,
    };
};
