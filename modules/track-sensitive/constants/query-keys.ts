import { QUERY_KEY } from '@/constants/query-key';
import { TrackSensitiveFilter } from '../types';

export const trackSensitiveQueryKeys = {
    all: [QUERY_KEY.TRACK_SENSITIVE.KEY] as const,
    lists: () =>
        [
            ...trackSensitiveQueryKeys.all,
            QUERY_KEY.TRACK_SENSITIVE.GET_LIST,
        ] as const,
    list: (params?: TrackSensitiveFilter) =>
        params
            ? ([...trackSensitiveQueryKeys.lists(), params] as const)
            : trackSensitiveQueryKeys.lists(),
};
