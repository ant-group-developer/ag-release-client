import { useInfiniteQuery } from '@tanstack/react-query';
import { artistApi } from '../apis';
import { artistQueryKeys } from '../constants/query-keys';
import { ArtistDataFilter } from '../types';

export const useGetArtistSimpleList = (
    params: ArtistDataFilter,
    options?: {
        enabled: boolean;
    }
) => {
    const { data, ...res } = useInfiniteQuery({
        queryKey: artistQueryKeys.listSimple(params),
        queryFn: ({ pageParam = 1 }) =>
            artistApi.getListSimple({ ...params, page: pageParam }),
        getNextPageParam: (lastPage) => {
            const pagination = lastPage?.data?.data?.metadata;
            if (!pagination) return undefined;

            const { page, totalPages } = pagination;
            return page < totalPages ? page + 1 : undefined;
        },
        enabled: options?.enabled ?? true,
        initialPageParam: 1,
        placeholderData: (prev) => prev,
    });

    const artistsData =
        data?.pages.flatMap((page) => page.data?.data?.items ?? []) ?? [];

    return {
        artistsData,
        ...res,
    };
};
