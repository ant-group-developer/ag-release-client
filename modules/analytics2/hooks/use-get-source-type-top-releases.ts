import { DEFAULT_DATA_PAGINATION } from '@/constants/common';
import { useQuery } from '@tanstack/react-query';
import { analytics2Apis } from '../apis';
import { analytics2QueryKeys } from '../constants/query-keys';
import { RankingParams } from '../types';

export const useGetSourceTypeTopReleases = (
    sourceType: string,
    params: RankingParams,
    options?: { enabled?: boolean }
) => {
    const query = useQuery({
        queryKey: analytics2QueryKeys.sourceTypeTopReleases(sourceType, params),
        queryFn: () => analytics2Apis.getSourceTypeTopReleases(sourceType, params),
        placeholderData: (prev) => prev,
        ...options,
    });

    const sourceTypeTopReleasesData =
        query.data?.data?.data ?? DEFAULT_DATA_PAGINATION;

    return {
        sourceTypeTopReleasesData,
        ...query,
    };
};
