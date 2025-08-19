import { QUERY_KEY } from '@/constants/query-key';
import { RolesDataDataFilter } from '../types';

export const rolesQueryKeys = {
    all: [QUERY_KEY.ROLE.KEY] as const,

    lists: () =>
        [...rolesQueryKeys.all, QUERY_KEY.ROLE.GET_ROLE_LIST_ALL] as const,
    list: (params?: RolesDataDataFilter) =>
        params
            ? ([...rolesQueryKeys.lists(), params] as const)
            : rolesQueryKeys.lists(),

    details: () =>
        [...rolesQueryKeys.all, QUERY_KEY.ROLE.GET_ROLE_DETAIL] as const,
    detail: (id: string) => [...rolesQueryKeys.details(), id] as const,
};
