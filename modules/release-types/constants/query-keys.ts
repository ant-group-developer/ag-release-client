import { QUERY_KEY } from '@/constants/query-key';
import { ReleaseTypesDataFilter } from '../types';

export const releaseTypesQueryKeys = {
    all: [QUERY_KEY.RELEASE_TYPE.KEY] as const,

    lists: () =>
        [
            ...releaseTypesQueryKeys.all,
            QUERY_KEY.RELEASE_TYPE.GET_LIST,
        ] as const,
    list: (params?: ReleaseTypesDataFilter) =>
        params
            ? ([...releaseTypesQueryKeys.lists(), params] as const)
            : releaseTypesQueryKeys.lists(),

    details: () =>
        [
            ...releaseTypesQueryKeys.all,
            QUERY_KEY.RELEASE_TYPE.GET_DETAIL,
        ] as const,
    detail: (id: string) => [...releaseTypesQueryKeys.details(), id] as const,
};
