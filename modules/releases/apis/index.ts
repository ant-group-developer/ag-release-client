import axiosAuth from '@/api/axios-auth';
import { DetailResponse, PaginationResponse } from '@/types/api';
import { ReleasesData, ReleasesDataFilter } from '../types';

export const releasesApi = {
    getList: (params: ReleasesDataFilter) => {
        return axiosAuth.get<PaginationResponse<ReleasesData>>('/releases', {
            params,
        });
    },
    getDetail: (id: ReleasesData['id']) => {
        return axiosAuth.get<DetailResponse<ReleasesData>>(`/releases/${id}`);
    },
};
