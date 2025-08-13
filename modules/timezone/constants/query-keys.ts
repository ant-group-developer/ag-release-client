import { QUERY_KEY } from '@/constants/query-key';
import { TimezoneDataFilter } from '../types';

export const timezoneQueryKeys = {
    all: [QUERY_KEY.TIMEZONE.KEY] as const,

    lists: () =>
        [...timezoneQueryKeys.all, QUERY_KEY.TIMEZONE.GET_LIST] as const,
    list: (params?: TimezoneDataFilter) =>
        params
            ? ([...timezoneQueryKeys.lists(), params] as const)
            : timezoneQueryKeys.lists(),

    details: () =>
        [...timezoneQueryKeys.all, QUERY_KEY.TIMEZONE.GET_DETAIL] as const,
    detail: (id: string) => [...timezoneQueryKeys.details(), id] as const,
};
