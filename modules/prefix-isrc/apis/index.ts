import axiosAuth from '@/api/axios-auth';
import type { PaginationResponse } from '@/types/api';
import type { PrefixIsrcData, PrefixIsrcDataFilter } from '../types';

export const prefixIsrcApis = {
    getList: (params: PrefixIsrcDataFilter) => {
        return axiosAuth.get<PaginationResponse<PrefixIsrcData>>(
            '/isrc/prefix',
            { params }
        );
    },
};
