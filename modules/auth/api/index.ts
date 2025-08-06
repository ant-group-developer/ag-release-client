import axiosAccount from '@/api/axios-account';
import { DetailResponse } from '@/types/api';
import { UserInfoData } from '../types/common';

export const authApi = {
    getInfo() {
        return axiosAccount.get<DetailResponse<UserInfoData>>('/auth/me');
    },
};
