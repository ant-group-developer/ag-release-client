import axiosInstance from '@/api/axios-auth';
import { DetailResponse, PaginationResponse } from '@/types/api';
import {
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

    getUserRole(id: string) {
        return axiosInstance.get<DetailResponse<UserRoleData[]>>(
            `/user-role/${id}/role`
        );
    },

    getUserPermission(id: string) {
        return axiosInstance.get<DetailResponse<UserPermissionData[]>>(
            `/user-role/${id}/permission`
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

    updateRole(payload: UpdateUserRolePayload) {
        return axiosInstance.post(`/user-role`, payload);
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

    remove(id: string) {
        return axiosInstance.delete<DetailResponse<UserDetail>>(`/users/${id}`);
    },
};
