import {
    QueryClient,
    useIsFetching,
    useIsMutating,
} from '@tanstack/react-query';

export enum LoadingType {
    Fetching = 'fetching',
    Mutating = 'mutating',
}

export const waitForLoading = (
    queryClient: QueryClient,
    type?: LoadingType
): Promise<void> => {
    const isMutating = () => queryClient.isMutating() > 0;
    const isFetching = () => queryClient.isFetching() > 0;

    const isLoading = () => {
        if (type === LoadingType.Fetching) return isFetching();
        if (type === LoadingType.Mutating) return isMutating();
        return isFetching() || isMutating();
    };

    if (!isLoading()) {
        return Promise.resolve();
    }

    return new Promise<void>((resolve) => {
        const checkAndResolve = () => {
            if (!isLoading()) {
                unsubscribeMutation();
                unsubscribeQuery();
                resolve();
            }
        };

        const unsubscribeMutation = queryClient
            .getMutationCache()
            .subscribe(checkAndResolve);
        const unsubscribeQuery = queryClient
            .getQueryCache()
            .subscribe(checkAndResolve);
    });
};

export function useLoading(type?: LoadingType) {
    const isFetching = useIsFetching();
    const isMutating = useIsMutating();

    if (type === LoadingType.Fetching) {
        return isFetching !== 0;
    }

    if (type === LoadingType.Mutating) {
        return isMutating !== 0;
    }

    return isFetching + isMutating !== 0;
}
