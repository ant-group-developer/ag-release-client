import axiosInstance from '@/api/axios-auth';
import { DetailResponse, PaginationResponse } from '@/types/api';
import {
    BulkUpdateTenantUserPayload,
    CreateUserPayload,
    DataFilterUser,
    InviteUserPayload,
    UpdateUserPayload,
    UpdateUserRolePayload,
    UserData,
    UserDetail,
    UserPermissionData,
    UserRoleData,
} from '../types/data';

export const userApi = {
    getList(params: DataFilterUser) {
        return axiosInstance.get<PaginationResponse<UserData>>('/users', {
            params,
        });
    },

    getUserRole(id: string, tenantId?: string) {
        return axiosInstance.get<DetailResponse<UserRoleData[]>>(
            `/users/${id}/roles`,
            { params: { tenantId } }
        );
    },

    getUserPermission(id: string, tenantId?: string) {
        return axiosInstance.get<DetailResponse<UserPermissionData[]>>(
            `/users/${id}/permissions`,
            { params: { tenantId } }
        );
    },

    getDetail(id: string) {
        return axiosInstance.get<DetailResponse<UserDetail>>(`/users/${id}`);
    },

    create(payload: CreateUserPayload) {
        return axiosInstance.post<DetailResponse<UserDetail>>(
            `/users`,
            payload
        );
    },

    invite(payload: InviteUserPayload) {
        return axiosInstance.post(`/users/invite`, payload);
    },

    updateRole(
        userId: string,
        payload: { roleIds: string[]; tenantId?: string }
    ) {
        return axiosInstance.post(`/users/${userId}/roles`, payload);
    },

    getAssignableRoles(tenantId?: string) {
        return axiosInstance.get<DetailResponse<UserRoleData[]>>(
            `/users/assignable-roles`,
            { params: { tenantId } }
        );
    },

    update(id: string, payload: UpdateUserPayload) {
        return axiosInstance.put<DetailResponse<UserDetail>>(
            `/users/${id}`,
            payload
        );
    },

    syncData() {
        return axiosInstance.post(`/users/sync-data`);
    },

    bulkUpdateTenantUser(payload: BulkUpdateTenantUserPayload) {
        return axiosInstance.post(`/users/bulk-update-tenant-user`, payload);
    },

    remove(id: string) {
        return axiosInstance.delete<DetailResponse<UserDetail>>(`/users/${id}`);
    },
};
