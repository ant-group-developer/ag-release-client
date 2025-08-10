import axiosInstance from '@/api/axios-auth';
import { DetailResponse } from '@/types/api';
import axios, { AxiosInstance } from 'axios';
import { GetTokenResponse, RefreshDto, SigninDto } from '../types/auth';
import { UserInfoData } from '../types/common';

const axiosAuth: AxiosInstance = axios.create({
    baseURL: process.env.API_URL + '/auth',
    headers: {
        'Content-Type': 'application/json',
    },
});

export const authApi = {
    signin: (payload: SigninDto) =>
        axiosAuth.post<DetailResponse<GetTokenResponse>>(`/login`, payload),

    refreshToken: (payload: RefreshDto) =>
        axiosAuth.post<DetailResponse<GetTokenResponse>>(`/refresh`, payload),

    getInfo() {
        return axiosInstance.get<DetailResponse<UserInfoData>>('/auth/me');
    },
};
