import { useInfiniteQuery } from '@tanstack/react-query';
import { releasesApi } from '../apis';
import { releasesQueryKeys } from '../constants/query-keys';
import { ReleasesDataFilter } from '../types';

export const useGetReleaseSimpleList = (
    params: ReleasesDataFilter,
    options?: {
        enabled: boolean;
    }
) => {
    const { data, ...res } = useInfiniteQuery({
        queryKey: releasesQueryKeys.list(params),
        queryFn: ({ pageParam = 1 }) =>
            releasesApi.getListSimple({ ...params, page: pageParam }),
        getNextPageParam: (lastPage) => {
            const pagination = lastPage?.data?.data?.metadata;
            if (!pagination) return undefined;

            const { currentPage, totalPages } = pagination;
            return currentPage < totalPages ? currentPage + 1 : undefined;
        },
        enabled: options?.enabled ?? true,
        initialPageParam: 1,
        placeholderData: (prev) => prev,
    });

    const releasesData =
        data?.pages.flatMap((page) => page?.data?.data?.items ?? []) ?? [];

    return {
        releasesData,
        ...res,
    };
};
