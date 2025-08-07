import axiosAuth from '@/api/axios-auth';
import { DetailResponse } from '@/types/api';
import { UserInfoData } from '../types/common';

export const authApi = {
    getInfo() {
        return axiosAuth.get<DetailResponse<UserInfoData>>('/auth/me');
    },
};
