import { QUERY_KEY } from '@/constants/query-key';
import { PermissionDataDataFilter } from '../types';

export const permissionQueryKeys = {
    all: [QUERY_KEY.PERMISSION.KEY] as const,

    lists: () =>
        [
            ...permissionQueryKeys.all,
            QUERY_KEY.PERMISSION.GET_LIST_PERMISSION,
        ] as const,
    list: (params?: PermissionDataDataFilter) =>
        params
            ? ([...permissionQueryKeys.lists(), params] as const)
            : permissionQueryKeys.lists(),

    details: () =>
        [
            ...permissionQueryKeys.all,
            QUERY_KEY.PERMISSION.GET_DETAIL_PERMISSION,
        ] as const,
    detail: (id: string) => [...permissionQueryKeys.details(), id] as const,
};
