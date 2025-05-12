import axiosAccount from '@/api/axios-account';
import { DetailResponse } from '@/types/api';
import { LoginPayload, LoginResponse, UserInfoData } from '../types/common';

export const authApi = {
    login(payload: LoginPayload) {
        return axiosAccount.post<LoginResponse>(`/auth/login`, payload);
    },

    refreshToken(refresh_token: string) {
        return axiosAccount.post<LoginResponse>('/auth/refresh-token', {
            refresh_token,
        });
    },

    getInfo() {
        return axiosAccount.get<DetailResponse<UserInfoData>>('/auth/me');
    },
};
