import axiosInstance from '@/api/axios-auth';
import { TENANT_REQUEST_HEADERS } from '@/modules/tenant/constants';
import { TenantDetail } from '@/modules/tenant/types/data';
import { DetailResponse } from '@/types/api';
import axios, { AxiosInstance } from 'axios';
import {
    GetTokenResponse,
    RefreshDto,
    SigninDto,
    SwitchTenantDto,
    UserInfoData,
} from '../types/auth';

const axiosAuth: AxiosInstance = axios.create({
    baseURL: process.env.API_URL + '/auth',
    headers: {
        'Content-Type': 'application/json',
    },
});

export const authApi = {
    signin: (payload: SigninDto, customDomain?: string) =>
        axiosAuth.post<DetailResponse<GetTokenResponse>>(`/login`, payload, {
            headers: customDomain
                ? { [TENANT_REQUEST_HEADERS.CUSTOM_DOMAIN]: customDomain }
                : undefined,
        }),

    refreshToken: (payload: RefreshDto) =>
        axiosAuth.post<DetailResponse<GetTokenResponse>>(`/refresh`, payload),

    switchTenant: (token: string, payload: SwitchTenantDto) => {
        axiosAuth.defaults.headers['Authorization'] = `Bearer ${token}`;
        return axiosAuth.post<DetailResponse<GetTokenResponse>>(
            `/switch-tenant`,
            payload
        );
    },

    getInfo() {
        return axiosInstance.get<DetailResponse<UserInfoData>>('/auth/me');
    },

    getTenant() {
        return axiosInstance.get<DetailResponse<TenantDetail>>('/auth/tenant');
    },
};

export async function getCurrentTenant(
    cookie: string
): Promise<TenantDetail | null> {
    try {
        const res = await fetch(
            process.env.NEXTAUTH_URL + '/api/proxy/auth/tenant',
            {
                headers: { cookie },
                cache: 'no-store', // tenant can change per-request
            }
        );
        // const text = await res.text();
        // console.log('Backend error body:', text);
        if (!res.ok) return null;
        const json = await res.json();
        return (json?.data ?? json) as TenantDetail;
    } catch (error) {
        console.log('error:', error);
        return null;
    }
}
