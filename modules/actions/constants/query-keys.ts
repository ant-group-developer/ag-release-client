import { QUERY_KEY } from '@/constants/query-key';
import { ActionsDataFilter } from '../types';

export const actionsQueryKeys = {
    all: [QUERY_KEY.ACTIONS.KEY] as const,

    lists: () => [...actionsQueryKeys.all, QUERY_KEY.ACTIONS.GET_LIST] as const,
    listsSimple: () =>
        [...actionsQueryKeys.all, QUERY_KEY.ACTIONS.GET_LIST_SIMPLE] as const,
    list: (params?: ActionsDataFilter) =>
        params
            ? ([...actionsQueryKeys.lists(), params] as const)
            : actionsQueryKeys.lists(),

    details: () =>
        [...actionsQueryKeys.all, QUERY_KEY.ACTIONS.GET_DETAIL] as const,
    detail: (id: string) => [...actionsQueryKeys.details(), id] as const,
};
