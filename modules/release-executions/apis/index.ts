import axiosInstance from '@/api/axios-auth';
import { DetailResponse } from '@/types/api';
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
    downloadManualExport: (ids: string[]) => {
        return axiosInstance.post(
            '/release-executions/manual-export/bulk-download',
            { ids },
            {
                responseType: 'blob',
            }
        );
    },
    bulkMarkCompleted: (ids: string[]) => {
        return axiosInstance.post(
            '/release-executions/manual-export/bulk-mark-completed',
            { ids }
        );
    },
};
