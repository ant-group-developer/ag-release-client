import axiosInstance from '@/api/axios-auth';
import { DetailResponse, PaginationResponse } from '@/types/api';
import {
    CreateUserPayload,
    DataFilterUser,
    InviteUserPayload,
    UpdateUserPayload,
    UserData,
    UserDetail,
} from '../types/data';

export const userApi = {
    getList(params: DataFilterUser) {
        return axiosInstance.get<PaginationResponse<UserData>>('/users', {
            params,
        });
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

    update(id: string, payload: UpdateUserPayload) {
        return axiosInstance.put<DetailResponse<UserDetail>>(
            `/users/${id}`,
            payload
        );
    },

    syncData() {
        return axiosInstance.post(`/users/sync-data`);
    },
};
