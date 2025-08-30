import { QUERY_KEY } from '@/constants/query-key';

export const trackTypeQueryKeys = {
    all: [QUERY_KEY.TRACK_TYPE.KEY] as const,

    lists: () =>
        [...trackTypeQueryKeys.all, QUERY_KEY.TRACK_TYPE.GET_LIST] as const,
    listsSimple: () =>
        [
            ...trackTypeQueryKeys.all,
            QUERY_KEY.TRACK_TYPE.GET_LIST_SIMPLE,
        ] as const,
    list: (params?: Record<string, any>) =>
        params
            ? ([...trackTypeQueryKeys.lists(), params] as const)
            : trackTypeQueryKeys.lists(),

    details: () =>
        [...trackTypeQueryKeys.all, QUERY_KEY.TRACK_TYPE.GET_DETAIL] as const,
    detail: (id: string) => [...trackTypeQueryKeys.details(), id] as const,
};
