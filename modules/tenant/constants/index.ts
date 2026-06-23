import { QUERY_KEY } from '@/constants/query-key';
import { DataFilterTenant } from '../types/data';

export const tenantQueryKeys = {
    all: [QUERY_KEY.TENANT.KEY],
    active: () =>
        [...tenantQueryKeys.all, QUERY_KEY.TENANT.GET_ACTIVE] as const,
    activeAccessible: () =>
        [...tenantQueryKeys.all, QUERY_KEY.TENANT.GET_ACTIVE_ACCESSIBLE] as const,
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
    dspAgreements: () => [...tenantQueryKeys.all, QUERY_KEY.TENANT.GET_DSP_AGREEMENT] as const,
    dspAgreement: (id: string) => [...tenantQueryKeys.dspAgreements(), id] as const,
    dspAgreementsUser: () => [...tenantQueryKeys.all, QUERY_KEY.TENANT.GET_DSP_AGREEMENT_USER] as const,
    roles: () =>
        [...tenantQueryKeys.all, QUERY_KEY.TENANT.GET_ROLES] as const,
    tenantRoles: (id: string) =>
        [...tenantQueryKeys.roles(), id] as const,
    updates: () => [...tenantQueryKeys.all, QUERY_KEY.TENANT.UPDATE] as const,
    update: (id: string) => [...tenantQueryKeys.updates(), id] as const,
    creates: () => [...tenantQueryKeys.all, QUERY_KEY.TENANT.CREATE] as const,
};

export const SYSTEM_TENANT_ID = 'system-tenant';
