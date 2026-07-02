import { QUERY_KEY } from '@/constants/query-key';
import { DataFilterTenant } from '../types/data';

export const tenantQueryKeys = {
    all: [QUERY_KEY.TENANT.KEY],
    active: () =>
        [...tenantQueryKeys.all, QUERY_KEY.TENANT.GET_ACTIVE] as const,
    activeAccessible: () =>
        [
            ...tenantQueryKeys.all,
            QUERY_KEY.TENANT.GET_ACTIVE_ACCESSIBLE,
        ] as const,
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
    dsps: () => [...tenantQueryKeys.all, QUERY_KEY.TENANT.GET_DSP] as const,
    dsp: (id: string) => [...tenantQueryKeys.dsps(), id] as const,
    dspAgreements: () =>
        [...tenantQueryKeys.all, QUERY_KEY.TENANT.GET_DSP_AGREEMENT] as const,
    dspAgreement: (id: string) =>
        [...tenantQueryKeys.dspAgreements(), id] as const,
    dspAgreementsUser: () =>
        [
            ...tenantQueryKeys.all,
            QUERY_KEY.TENANT.GET_DSP_AGREEMENT_USER,
        ] as const,
    roles: () => [...tenantQueryKeys.all, QUERY_KEY.TENANT.GET_ROLES] as const,
    tenantRoles: (id: string) => [...tenantQueryKeys.roles(), id] as const,
    updates: () => [...tenantQueryKeys.all, QUERY_KEY.TENANT.UPDATE] as const,
    update: (id: string) => [...tenantQueryKeys.updates(), id] as const,
    creates: () => [...tenantQueryKeys.all, QUERY_KEY.TENANT.CREATE] as const,
    createDomain: (tenantId: string) =>
        [
            ...tenantQueryKeys.all,
            QUERY_KEY.TENANT.CREATE_DOMAIN,
            tenantId,
        ] as const,
    verifyDomain: (tenantId: string) =>
        [
            ...tenantQueryKeys.all,
            QUERY_KEY.TENANT.VERIFY_DOMAIN,
            tenantId,
        ] as const,
    getDomain: (tenantId: string) =>
        [
            ...tenantQueryKeys.all,
            QUERY_KEY.TENANT.GET_DOMAIN,
            tenantId,
        ] as const,
    resolveDomain: (domain: string) =>
        [
            ...tenantQueryKeys.all,
            QUERY_KEY.TENANT.RESOLVE_DOMAIN,
            domain,
        ] as const,
    getCfOAuthUrl: (tenantId: string) =>
        [
            ...tenantQueryKeys.all,
            QUERY_KEY.TENANT.GET_CF_OAUTH_URL,
            tenantId,
        ] as const,
};

export const SYSTEM_TENANT_ID = 'system-tenant';

export const TENANT_REQUEST_HEADERS = {
    CUSTOM_DOMAIN: 'x-custom-domain',
} as const;

export const TENANT_API_ENDPOINTS = {
    DOMAIN: (tenantId: string) => `/tenants/${tenantId}/domain`,
    VERIFY_DOMAIN: (tenantId: string) => `/tenants/${tenantId}/domain/verify`,
    CF_OAUTH_URL: (tenantId: string) =>
        `/tenants/${tenantId}/domain/cf-oauth-url`,
} as const;
