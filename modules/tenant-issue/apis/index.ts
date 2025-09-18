import axiosInstance from '@/api/axios-auth';
import { DetailResponse, PaginationResponse } from '@/types/api';
import { TenantIssueData, TenantIssueDataFilter } from '../types';
import {
    CreateTenantIssuePayload,
    UpdateTenantIssuePayload,
} from '../types/payloads';

export const tenantIssueApis = {
    getList: (params: TenantIssueDataFilter) => {
        return axiosInstance.get<PaginationResponse<TenantIssueData>>(
            '/tenant-issues',
            {
                params,
            }
        );
    },

    getListSimple: () => {
        return axiosInstance.get<DetailResponse<TenantIssueData[]>>(
            '/tenant-issues/simple'
        );
    },

    getDetail: (id: TenantIssueData['id']) => {
        return axiosInstance.get<DetailResponse<TenantIssueData>>(
            `/tenant-issues/${id}`
        );
    },

    create: (payload: CreateTenantIssuePayload) => {
        return axiosInstance.post<DetailResponse<TenantIssueData>>(
            '/tenant-issues',
            payload
        );
    },

    update: (id: TenantIssueData['id'], payload: UpdateTenantIssuePayload) => {
        return axiosInstance.put<DetailResponse<TenantIssueData>>(
            `/tenant-issues/${id}`,
            payload
        );
    },

    delete: (id: TenantIssueData['id']) => {
        return axiosInstance.delete(`/tenant-issues/${id}`);
    },
};
