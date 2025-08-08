import type { MutationKey, QueryKey } from '@tanstack/react-query';
import { useIsFetching, useIsMutating } from '@tanstack/react-query';

type UseLoadingStatusOptions = {
    /** QueryKeys to watch (e.g. ['todos'], ['user', id], …) */
    queryKeys?: QueryKey[];
    /** MutationKeys to watch (e.g. 'addTodo', ['updateUser', id], …) */
    mutationKeys?: MutationKey[];
};

type UseLoadingStatusResult = {
    fetchingCount: number;
    isFetching: boolean;
    mutatingCount: number;
    isMutating: boolean;
    isLoading: boolean;
};

/**
 * Watch one or more queryKeys and/or mutationKeys.
 */
export function useLoadingStatus({
    queryKeys = [],
    mutationKeys = [],
}: UseLoadingStatusOptions): UseLoadingStatusResult {
    // count matching active queries
    const fetchingCount = useIsFetching({
        predicate: (q) =>
            queryKeys.some((key) =>
                Array.isArray(key)
                    ? JSON.stringify(q.queryKey) === JSON.stringify(key)
                    : q.queryKey[0] === key
            ),
    });

    // count matching running mutations
    const mutatingCount = useIsMutating({
        predicate: (m) =>
            mutationKeys.some((key) =>
                Array.isArray(key)
                    ? JSON.stringify(m.options.mutationKey) ===
                      JSON.stringify(key)
                    : m.options.mutationKey === key
            ),
    });

    const isFetching = fetchingCount > 0;
    const isMutating = mutatingCount > 0;

    return {
        fetchingCount,
        isFetching,
        mutatingCount,
        isMutating,
        isLoading: isFetching && isMutating,
    };
}
