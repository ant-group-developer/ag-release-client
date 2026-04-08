import axiosInstance from '@/api/axios-auth';
import { DetailResponse, PaginationResponse } from '@/types/api';
import {
    ReleaseExecutionData,
    ReleaseExecutionFilter,
    ReleaseExecutionPaginationResponse,
} from '../types';

export const releaseExecutionApis = {
    getList: (params: ReleaseExecutionFilter) => {
        return axiosInstance.get<ReleaseExecutionPaginationResponse>(
            '/release-executions',
            { params }
        );
    },
    getDetail: (id: string) => {
        return axiosInstance.get<DetailResponse<ReleaseExecutionData>>(
            `/release-executions/${id}`
        );
    },
    retry: (id: string) => {
        return axiosInstance.post<DetailResponse<ReleaseExecutionData>>(
            `/release-executions/${id}/retry`
        );
    },
};
