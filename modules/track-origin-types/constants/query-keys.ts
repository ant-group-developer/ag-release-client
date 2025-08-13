import { QUERY_KEY } from '@/constants/query-key';
import { TrackOriginTypeDataFilter } from '../types';

export const trackOriginTypeQueryKeys = {
    all: [QUERY_KEY.TRACK_ORIGIN_TYPE.KEY] as const,

    lists: () =>
        [
            ...trackOriginTypeQueryKeys.all,
            QUERY_KEY.TRACK_ORIGIN_TYPE.GET_LIST,
        ] as const,
    list: (params?: TrackOriginTypeDataFilter) =>
        params
            ? ([...trackOriginTypeQueryKeys.lists(), params] as const)
            : trackOriginTypeQueryKeys.lists(),

    details: () =>
        [
            ...trackOriginTypeQueryKeys.all,
            QUERY_KEY.TRACK_ORIGIN_TYPE.GET_DETAIL,
        ] as const,
    detail: (id: string) =>
        [...trackOriginTypeQueryKeys.details(), id] as const,
};
