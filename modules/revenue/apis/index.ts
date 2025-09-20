import axiosInstance from '@/api/axios-auth';
import { PaginationResponse } from '@/types/api';
import { RevenueData, RevenueDataFilter } from '../types';

export const revenueApi = {
    getList: (params: RevenueDataFilter) => {
        return axiosInstance.get<PaginationResponse<RevenueData>>(`/revenue`, {
            params,
        });
    },
};
