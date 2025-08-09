import type { MutationKey, QueryKey } from '@tanstack/react-query';
import { useIsFetching, useIsMutating } from '@tanstack/react-query';
import { useMemo } from 'react';

type UseLoadingStatusOptions = {
    queryKeys?: QueryKey[]; // e.g. ['todos'], ['user', id]
    mutationKeys?: MutationKey[]; // e.g. 'addTodo', ['updateUser', id]
};

type UseLoadingStatusResult = {
    fetchingCount: number;
    isFetching: boolean;
    mutatingCount: number;
    isMutating: boolean;
    isLoading: boolean;
};

const toArray = (k: QueryKey | string) => (Array.isArray(k) ? k : [k]);

const prefixMatch = (actual: readonly unknown[], filter: QueryKey | string) => {
    const f = toArray(filter);
    for (let i = 0; i < f.length; i++) if (actual[i] !== f[i]) return false;
    return true;
};

export function useLoadingStatus({
    queryKeys = [],
    mutationKeys = [],
}: UseLoadingStatusOptions): UseLoadingStatusResult {
    const queryPredicate = useMemo(
        () => (q: any) =>
            queryKeys.length === 0 ||
            queryKeys.some((key) => prefixMatch(q.queryKey, key)),
        [queryKeys]
    );

    const mutationPredicate = useMemo(
        () => (m: any) => {
            if (mutationKeys.length === 0) return true;
            const mk = m.options?.mutationKey as readonly unknown[] | undefined;
            if (!mk) return false;
            return mutationKeys.some((key) => prefixMatch(mk, key));
        },
        [mutationKeys]
    );

    const fetchingCount = useIsFetching({ predicate: queryPredicate });
    const mutatingCount = useIsMutating({ predicate: mutationPredicate });

    const isFetching = fetchingCount > 0;
    const isMutating = mutatingCount > 0;

    return {
        fetchingCount,
        isFetching,
        mutatingCount,
        isMutating,
        isLoading: isFetching || isMutating,
    };
}
