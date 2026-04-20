import axiosInstance from '@/api/axios-auth';
import { DetailResponse, PaginationResponse } from '@/types/api';
import {
    CreateTenantPayload,
    DataFilterTenant,
    TenantData,
    TenantDetail,
    TenantDspData,
    TenantRoleData,
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

    updateDsp(payload: UpdateTenantDspPayload) {
        return axiosInstance.post('tenants/dsps', payload);
    },

    getRoles(tenantId: string) {
        return axiosInstance.get<DetailResponse<TenantRoleData[]>>(
            `tenants/${tenantId}/configured-roles`
        );
    },

    updateRoles(tenantId: string, payload: UpdateTenantRolesPayload) {
        return axiosInstance.post(`tenants/${tenantId}/configured-roles`, payload);
    },
};
