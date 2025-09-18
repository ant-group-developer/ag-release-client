import { QUERY_KEY } from '@/constants/query-key';
import { TenantIssueDataFilter } from '../types';

export const tenantIssuesQueryKeys = {
    all: [QUERY_KEY.TENANT_ISSUE.KEY] as const,
    lists: () =>
        [
            ...tenantIssuesQueryKeys.all,
            QUERY_KEY.TENANT_ISSUE.GET_LIST,
        ] as const,
    list: (params?: TenantIssueDataFilter) =>
        params
            ? ([...tenantIssuesQueryKeys.lists(), params] as const)
            : tenantIssuesQueryKeys.lists(),
    updates: () =>
        [...tenantIssuesQueryKeys.all, QUERY_KEY.TENANT_ISSUE.UPDATE] as const,
};
