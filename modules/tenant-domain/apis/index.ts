import axiosInstance from '@/api/axios-auth';
import { defaultConfig } from '@/constants/env';
import { DetailResponse } from '@/types/api';
import {
    CfOAuthUrlResponse,
    DomainResolveResponse,
    GetDomainResponse,
    RegisterDomainResponse,
} from '../types';
import { RegisterDomainPayload } from '../types/payload';

export const tenantDomainApi = {
    register(tenantId: string, payload: RegisterDomainPayload) {
        return axiosInstance.post<DetailResponse<RegisterDomainResponse>>(
            `/tenants/${tenantId}/domain`,
            payload
        );
    },

    getDetail(tenantId: string) {
        return axiosInstance.get<DetailResponse<GetDomainResponse>>(
            `/tenants/${tenantId}/domain`
        );
    },

    verify(tenantId: string) {
        return axiosInstance.post<DetailResponse<GetDomainResponse>>(
            `/tenants/${tenantId}/domain/verify`
        );
    },

    deleteDomain(tenantId: string) {
        return axiosInstance.delete(`/tenants/${tenantId}/domain`);
    },

    getCfOAuthUrl(tenantId: string) {
        return axiosInstance.get<DetailResponse<CfOAuthUrlResponse>>(
            `/tenants/${tenantId}/domain/cf-oauth-url`
        );
    },

    async resolveDomain(domain: string): Promise<DomainResolveResponse | null> {
        try {
            const res = await fetch(
                `${defaultConfig.API_URL}/public/domain-resolve?domain=${encodeURIComponent(domain)}`,
                { cache: 'no-store' }
            );
            if (!res.ok) return null;
            const json = await res.json();
            return (json?.data ?? json) as DomainResolveResponse;
        } catch {
            return null;
        }
    },
};
