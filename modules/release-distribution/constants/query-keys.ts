import { ReleaseCiDataFilter } from '../types';

export const RELEASE_CI_DATA_KEYS = {
    ALL: 'RELEASE_CI_DATA',
    GET_LIST: 'GET_LIST',
    GET_DETAIL: 'GET_DETAIL',
    BY_RELEASE: 'by-release',
} as const;

export const releaseDistributionQueryKeys = {
    all: [RELEASE_CI_DATA_KEYS.ALL] as const,
    lists: () => [...releaseDistributionQueryKeys.all, RELEASE_CI_DATA_KEYS.GET_LIST] as const,
    list: (params?: ReleaseCiDataFilter) =>
        params
            ? ([...releaseDistributionQueryKeys.lists(), params] as const)
            : releaseDistributionQueryKeys.lists(),
    details: () => [...releaseDistributionQueryKeys.all, RELEASE_CI_DATA_KEYS.GET_DETAIL] as const,
    detail: (id: string) => [...releaseDistributionQueryKeys.details(), id] as const,
    detailByReleaseId: (releaseId: string) =>
        [...releaseDistributionQueryKeys.details(), RELEASE_CI_DATA_KEYS.BY_RELEASE, releaseId] as const,
};
