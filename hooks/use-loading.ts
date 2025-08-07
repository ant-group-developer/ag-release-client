import { useIsFetching, useIsMutating } from '@tanstack/react-query';

export enum LoadingType {
    Fetching = 'fetching',
    Mutating = 'mutating',
}

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
