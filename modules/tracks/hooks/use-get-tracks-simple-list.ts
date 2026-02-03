import { useInfiniteQuery } from '@tanstack/react-query';
import { trackApi } from '../apis';
import { trackQueryKeys } from '../constants/query-keys';
import { TrackDataFilter } from '../types';

export const useGetTrackSimpleList = (
    params: TrackDataFilter,
    options?: {
        enabled: boolean;
    }
) => {
    const { data, ...res } = useInfiniteQuery({
        queryKey: trackQueryKeys.list(params),
        queryFn: ({ pageParam = 1 }) =>
            trackApi.getListSimple({ ...params, page: pageParam }),
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

    const tracksData =
        data?.pages.flatMap((page) => page.data?.data?.items ?? []) ?? [];

    return {
        tracksData,
        ...res,
    };
};
