import { QUERY_KEY } from '@/constants/query-key';

export const tenantDomainQueryKeys = {
    all: [QUERY_KEY.TENANT_DOMAIN.KEY],
    details: () => [...tenantDomainQueryKeys.all, QUERY_KEY.TENANT_DOMAIN.GET_DETAIL] as const,
    detail: (tenantId: string) => [...tenantDomainQueryKeys.details(), tenantId] as const,
    cfOAuthUrls: () => [...tenantDomainQueryKeys.all, QUERY_KEY.TENANT_DOMAIN.GET_CF_OAUTH_URL] as const,
    cfOAuthUrl: (tenantId: string) => [...tenantDomainQueryKeys.cfOAuthUrls(), tenantId] as const,
};
