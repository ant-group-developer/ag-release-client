import axiosAuth from '@/api/axios-auth';
import type { PaginationResponse } from '@/types/api';
import { PrefixUpcData, PrefixUpcDataFilter } from '../types';

export const prefixUpcApis = {
    getList: (params: PrefixUpcDataFilter) => {
        return axiosAuth.get<PaginationResponse<PrefixUpcData>>('/upc/prefix', {
            params,
        });
    },
};
