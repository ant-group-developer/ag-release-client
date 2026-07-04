import { DEFAULT_DATA_PAGINATION } from '@/constants/common';
import { useQuery } from '@tanstack/react-query';
import { analytics2Apis } from '../apis';
import { analytics2QueryKeys } from '../constants/query-keys';
import { RankingParams } from '../types';

export const useGetLabelTopReleases = (
    labelId: string,
    params: RankingParams,
    options?: { enabled?: boolean }
) => {
    const query = useQuery({
        queryKey: analytics2QueryKeys.labelTopReleases(labelId, params),
        queryFn: () => analytics2Apis.getLabelTopReleases(labelId, params),
        placeholderData: (prev) => prev,
        ...options,
    });

    const labelTopReleasesData =
        query.data?.data?.data ?? DEFAULT_DATA_PAGINATION;

    return {
        labelTopReleasesData,
        ...query,
    };
};
