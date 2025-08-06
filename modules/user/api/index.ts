import axiosAuth from '@/api/axios-auth';
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
        return axiosAuth.get<PaginationResponse<UserData>>('/users', {
            params,
        });
    },

    getDetail(id: string) {
        return axiosAuth.get<DetailResponse<UserDetail>>(`/users/${id}`);
    },

    create(payload: CreateUserPayload) {
        return axiosAuth.post<DetailResponse<UserDetail>>(`/users`, payload);
    },

    update(id: string, payload: UpdateUserPayload) {
        return axiosAuth.put<DetailResponse<UserDetail>>(
            `/users/${id}`,
            payload
        );
    },

    syncData() {
        return axiosAuth.post(`/users/sync-data`);
    },
};
