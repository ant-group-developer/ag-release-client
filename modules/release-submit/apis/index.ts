import axiosInstance from '@/api/axios-auth';
import { DetailResponse } from '@/types/api';
import {
    ReleaseSubmitData,
    ReleaseSubmitFilter,
    ReleaseSubmitPaginationResponse,
} from '../types';

export const releaseSubmitApis = {
    getList: (params: ReleaseSubmitFilter) => {
        return axiosInstance.get<ReleaseSubmitPaginationResponse>(
            '/release-submits',
            { params }
        );
    },
    getDetail: (id: string) => {
        return axiosInstance.get<DetailResponse<ReleaseSubmitData>>(
            `/release-submits/${id}`
        );
    },
};
