import { QUERY_KEY } from '@/constants/query-key';
import { TenantTiersDataFilter } from '../types';

export const tenantTiersQueryKeys = {
    all: [QUERY_KEY.TENANT_TIERS.KEY] as const,
    lists: () =>
        [...tenantTiersQueryKeys.all, QUERY_KEY.TENANT_TIERS.GET_LIST] as const,
    list: (params?: TenantTiersDataFilter) =>
        params
            ? ([...tenantTiersQueryKeys.lists(), params] as const)
            : tenantTiersQueryKeys.lists(),
};
