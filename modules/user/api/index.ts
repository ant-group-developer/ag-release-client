import axiosInstance from '@/api/axios-auth';
import { DetailResponse, PaginationResponse } from '@/types/api';
import {
    CreateUserPayload,
    DataFilterUser,
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
