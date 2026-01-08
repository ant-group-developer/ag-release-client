import { QUERY_KEY } from '@/constants/query-key';
import { TrackContributorDataFilter } from '../types';

export const trackContributorQueryKeys = {
    all: [QUERY_KEY.TRACK_CONTRIBUTOR.KEY] as const,
    lists: () =>
        [
            ...trackContributorQueryKeys.all,
            QUERY_KEY.TRACK_CONTRIBUTOR.GET_LIST,
        ] as const,
    list: (params?: TrackContributorDataFilter) =>
        params
            ? ([...trackContributorQueryKeys.lists(), params] as const)
            : trackContributorQueryKeys.lists(),
};
