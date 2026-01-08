import { QUERY_KEY } from '@/constants/query-key';
import { ReleaseContributorDataFilter } from '../types';

export const releaseContributorQueryKeys = {
    all: [QUERY_KEY.RELEASE_CONTRIBUTOR.KEY] as const,

    lists: () =>
        [
            ...releaseContributorQueryKeys.all,
            QUERY_KEY.RELEASE_CONTRIBUTOR.GET_LIST,
        ] as const,
    list: (params?: ReleaseContributorDataFilter) =>
        params
            ? ([...releaseContributorQueryKeys.lists(), params] as const)
            : releaseContributorQueryKeys.lists(),
};
