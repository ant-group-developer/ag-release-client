import { DEFAULT_DATA_PAGINATION } from '@/constants/common';
import { useQuery } from '@tanstack/react-query';
import { releasesApi } from '../apis';
import { releasesQueryKeys } from '../constants/query-keys';
import { ReleaseReviewFilter } from '../types';

export const useGetReleaseReviews = (
    params: ReleaseReviewFilter,
    options?: {
        enabled?: boolean;
    }
) => {
    const apiParams = { ...params };

    const { data, ...res } = useQuery({
        queryKey: releasesQueryKeys.releaseReviewList(params),
        queryFn: () => releasesApi.getReleaseReviews(apiParams),
        placeholderData: (previousData) => previousData,
        enabled: options?.enabled ?? true,
    });

    const releaseReviewsData = data?.data?.data ?? DEFAULT_DATA_PAGINATION;

    return {
        releaseReviewsData,
        ...res,
    };
};
