import axiosInstance from '@/api/axios-auth';
import { DetailResponse, PaginationResponse } from '@/types/api';
import { TenantTiersData, TenantTiersDataFilter } from '../types';
import {
    CreateTenantTiersPayload,
    UpdateTenantTiersPayload,
} from '../types/payloads';

export const tenantTiersApis = {
    getList: (params: TenantTiersDataFilter) => {
        return axiosInstance.get<PaginationResponse<TenantTiersData>>(
            '/tenant-tiers',
            {
                params,
            }
        );
    },

    getListSimple: () => {
        return axiosInstance.get<DetailResponse<TenantTiersData[]>>(
            '/tenant-tiers/simple'
        );
    },

    getDetail: (id: TenantTiersData['id']) => {
        return axiosInstance.get<DetailResponse<TenantTiersData>>(
            `/tenant-tiers/${id}`
        );
    },

    create: (payload: CreateTenantTiersPayload) => {
        return axiosInstance.post<DetailResponse<TenantTiersData>>(
            '/tenant-tiers',
            payload
        );
    },

    update: (id: TenantTiersData['id'], payload: UpdateTenantTiersPayload) => {
        return axiosInstance.put<DetailResponse<TenantTiersData>>(
            `tenant-tiers/${id}`,
            payload
        );
    },

    delete: (id: TenantTiersData['id']) => {
        return axiosInstance.delete(`/tenant-tiers/${id}`);
    },
};
