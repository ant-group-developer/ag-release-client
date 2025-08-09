import axiosAuth from '@/api/axios-auth';
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
        return axiosAuth.get<PaginationResponse<TenantData>>('/tenants', {
            params,
        });
    },

    getActive() {
        return axiosAuth.get<PaginationResponse<TenantActiveData>>(
            `/tenants/active`
        );
    },

    getDetail(id: string) {
        return axiosAuth.get<DetailResponse<TenantDetail>>(`/tenants/${id}`);
    },

    create(payload: CreateTenantPayload) {
        return axiosAuth.post<DetailResponse<TenantDetail>>(
            `/tenants`,
            payload
        );
    },

    update(id: string, payload: UpdateTenantPayload) {
        return axiosAuth.put<DetailResponse<TenantDetail>>(
            `/tenants/${id}`,
            payload
        );
    },
};
