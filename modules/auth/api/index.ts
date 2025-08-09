import axiosAuth from '@/api/axios-auth';
import { DetailResponse } from '@/types/api';
import { GetTokenResponse, RefreshDto, SigninDto } from '../types/auth';
import { UserInfoData } from '../types/common';

export const authApi = {
    signin: (payload: SigninDto) =>
        axiosAuth.post<DetailResponse<GetTokenResponse>>(`/signin`, payload),

    getInfo() {
        return axiosAuth.get<DetailResponse<UserInfoData>>('/auth/me');
    },

    refreshToken: (payload: RefreshDto) =>
        axiosAuth.post<DetailResponse<GetTokenResponse>>(`/refresh`, payload),
};
