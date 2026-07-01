import { ReleaseCiDataFilter } from '../types';

export const releaseDistributionQueryKeys = {
    all: ['RELEASE_CI_DATA'] as const,
    lists: () => [...releaseDistributionQueryKeys.all, 'GET_LIST'] as const,
    list: (params?: ReleaseCiDataFilter) =>
        params
            ? ([...releaseDistributionQueryKeys.lists(), params] as const)
            : releaseDistributionQueryKeys.lists(),
    details: () => [...releaseDistributionQueryKeys.all, 'GET_DETAIL'] as const,
    detail: (id: string) => [...releaseDistributionQueryKeys.details(), id] as const,
};
