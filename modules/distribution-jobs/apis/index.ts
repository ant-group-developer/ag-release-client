import axiosInstance from '@/api/axios-auth';
import { PaginationResponse } from '@/types/api';
import {
    DistributionJobFilter,
    DistributionJobGroupedData,
    DistributionJobPaginationResponse,
    UpdateDistributionJobPayload,
} from '../types';

export const distributionJobApis = {
    getList: (params: DistributionJobFilter) => {
        return axiosInstance.get<DistributionJobPaginationResponse>(
            '/ci-distribution-jobs',
            { params }
        );
    },
    getGroupedList: (params: DistributionJobFilter) => {
        return axiosInstance.get<
            PaginationResponse<DistributionJobGroupedData>
        >('/ci-distribution-jobs/grouped', { params });
    },

    autoSendEmail: (ids: any[]) => {
        return axiosInstance.post('/ci-distribution-jobs/auto-send-email', {
            ids,
        });
    },
    downloadExcel: (ids: any[]) => {
        return axiosInstance.post(
            '/ci-distribution-jobs/download-excel',
            { ids },
            { responseType: 'blob' }
        );
    },
    confirmCompleted: (data: { ids: any[]; exportIdFromCi: string }) => {
        return axiosInstance.post(
            '/ci-distribution-jobs/confirm-completed',
            data
        );
    },
    update: (id: string, data: UpdateDistributionJobPayload) => {
        return axiosInstance.put(`/ci-distribution-jobs/${id}`, data);
    },
};
