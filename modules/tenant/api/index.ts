import axiosInstance from '@/api/axios-auth';
import { DetailResponse, PaginationResponse } from '@/types/api';
import { TENANT_API_ENDPOINTS } from '../constants';
import {
    CreateTenantDomainPayload,
    CreateTenantPayload,
    DataFilterTenant,
    DomainResolveParams,
    DomainResolveResponse,
    TenantData,
    TenantDetail,
    TenantDomainResponse,
    TenantDomainData,
    TenantDspAgreementData,
    TenantDspData,
    UpdateTenantDspAgreementPayload,
    UpdateTenantDspPayload,
    UpdateTenantPayload,
    UpdateTenantRolesPayload,
} from '../types/data';

export const tenantApi = {
    getList(params: DataFilterTenant) {
        return axiosInstance.get<PaginationResponse<TenantData>>('/tenants', {
            params,
        });
    },

    getListSimple: () => {
        return axiosInstance.get<DetailResponse<TenantData[]>>(
            '/tenants/simple'
        );
    },

    getActive() {
        return axiosInstance.get<PaginationResponse<TenantData>>(
            `/tenants/active`
        );
    },

    getActiveAccessible() {
        return axiosInstance.get<PaginationResponse<TenantData>>(
            `/tenants/active/accessible`
        );
    },

    getDetail(id: string) {
        return axiosInstance.get<DetailResponse<TenantDetail>>(
            `/tenants/${id}`
        );
    },

    create(payload: CreateTenantPayload) {
        return axiosInstance.post<DetailResponse<TenantDetail>>(
            `/tenants`,
            payload
        );
    },

    createDomain(tenantId: string, payload: CreateTenantDomainPayload) {
        return axiosInstance.post<DetailResponse<TenantDomainResponse>>(
            TENANT_API_ENDPOINTS.DOMAIN(tenantId),
            payload
        );
    },

    getDomain(tenantId: string) {
        return axiosInstance.get<DetailResponse<TenantDomainResponse>>(
            TENANT_API_ENDPOINTS.DOMAIN(tenantId)
        );
    },

    verifyDomain(tenantId: string) {
        return axiosInstance.post<DetailResponse<TenantDomainData>>(
            TENANT_API_ENDPOINTS.VERIFY_DOMAIN(tenantId)
        );
    },

    deleteDomain(tenantId: string) {
        return axiosInstance.delete<DetailResponse<any>>(
            TENANT_API_ENDPOINTS.DOMAIN(tenantId)
        );
    },

    update(id: string, payload: UpdateTenantPayload) {
        return axiosInstance.put<DetailResponse<TenantDetail>>(
            `/tenants/${id}`,
            payload
        );
    },

    getDsp(id: string) {
        return axiosInstance.get<DetailResponse<TenantDspData[]>>(
            `tenants/dsps/${id}`
        );
    },

    getTenantDspAgreements(id: string) {
        return axiosInstance.get<DetailResponse<TenantDspAgreementData[]>>(
            `/tenant-dsp-agreements/admin/tenants/${id}/dsps`
        );
    },

    getTenantDspAgreementsUser() {
        return axiosInstance.get<DetailResponse<TenantDspAgreementData[]>>(
            `/tenant-dsp-agreements/tenant/dsps`
        );
    },

    updateTenantDspAgreement(
        tenantId: string,
        payload: UpdateTenantDspAgreementPayload
    ) {
        return axiosInstance.patch(
            `/tenant-dsp-agreements/admin/tenants/${tenantId}/dsps`,
            payload
        );
    },

    updateDsp(payload: UpdateTenantDspPayload) {
        return axiosInstance.post('tenants/dsps', payload);
    },

    getRoles(tenantId: string) {
        return axiosInstance.get<DetailResponse<string[]>>(
            `tenants/${tenantId}/configured-roles`
        );
    },

    updateRoles(tenantId: string, payload: UpdateTenantRolesPayload) {
        return axiosInstance.post(
            `tenants/${tenantId}/configured-roles`,
            payload
        );
    },

    resolveDomain(params: DomainResolveParams) {
        return axiosInstance.get<DetailResponse<DomainResolveResponse>>(
            '/public/domain-resolve',
            {
                params,
            }
        );
    },
};
