import { QUERY_KEY } from '@/constants/query-key';
import { DataFilterUser } from '../types/data';

export const userQueryKeys = {
    all: [QUERY_KEY.USER.KEY],
    lists: () => [...userQueryKeys.all, QUERY_KEY.USER.GET_USER_LIST] as const,
    list: (params?: DataFilterUser) => {
        const result: any[] = [...userQueryKeys.lists()];
        if (params) {
            result.push(params);
        }
        return result;
    },
    details: () =>
        [...userQueryKeys.all, QUERY_KEY.USER.GET_USER_DETAIL] as const,
    detail: (id: string) => [...userQueryKeys.details(), id] as const,
    info: () => [...userQueryKeys.all, QUERY_KEY.USER.GET_PROFILE] as const,
};
