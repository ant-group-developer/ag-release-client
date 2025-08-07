import { QUERY_KEY } from '@/constants/query-key';
import { DataFilterTenant } from '../types/data';

export const tenantQueryKeys = {
    all: [QUERY_KEY.TENANT.KEY],
    lists: () => [...tenantQueryKeys.all, QUERY_KEY.TENANT.GET_LIST] as const,
    list: (params?: DataFilterTenant) => {
        const result: any[] = [...tenantQueryKeys.lists()];
        if (params) {
            result.push(params);
        }
        return result;
    },
    details: () =>
        [...tenantQueryKeys.all, QUERY_KEY.TENANT.GET_DETAIL] as const,
    detail: (id: string) => [...tenantQueryKeys.details(), id] as const,
};
