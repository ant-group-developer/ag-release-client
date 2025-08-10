import axiosInstance from '@/api/axios-auth';
import { DetailResponse, PaginationResponse } from '@/types/api';
import {
    CreateTenantPayload,
    DataFilterTenant,
    TenantActiveData,
    TenantData,
    TenantDetail,
    UpdateTenantPayload,
} from '../types/data';

export const tenantApi = {
    getList(params: DataFilterTenant) {
        return axiosInstance.get<PaginationResponse<TenantData>>('/tenants', {
            params,
        });
    },

    getActive() {
        return axiosInstance.get<PaginationResponse<TenantActiveData>>(
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
};
