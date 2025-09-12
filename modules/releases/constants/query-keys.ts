import { QUERY_KEY } from '@/constants/query-key';
import { ReleasesDataFilter } from '../types';

export const releasesQueryKeys = {
    all: [QUERY_KEY.RELEASES.KEY] as const,

    downloadAssets: () => [
        ...releasesQueryKeys.all,
        QUERY_KEY.RELEASES.DOWNLOAD_ASSET,
    ],
    lists: () =>
        [...releasesQueryKeys.all, QUERY_KEY.RELEASES.GET_LIST] as const,
    list: (params?: ReleasesDataFilter) =>
        params
            ? ([...releasesQueryKeys.lists(), params] as const)
            : releasesQueryKeys.lists(),
    details: () =>
        [...releasesQueryKeys.all, QUERY_KEY.RELEASES.GET_DETAIL] as const,
    detail: (id: string) => [...releasesQueryKeys.details(), id] as const,

    validations: () =>
        [...releasesQueryKeys.all, QUERY_KEY.RELEASES.VALIDATE] as const,
    validate: (id: string) => [...releasesQueryKeys.validations(), id] as const,
};
