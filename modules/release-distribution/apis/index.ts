import axiosInstance from '@/api/axios-auth';
import { DetailResponse, PaginationResponse } from '@/types/api';
import { ReleaseCiData, ReleaseCiDataFilter } from '../types';

export const releaseDistributionApi = {
    getListReleaseCiData: (params: ReleaseCiDataFilter) => {
        return axiosInstance.get<PaginationResponse<ReleaseCiData>>(
            '/release-ci-data',
            {
                params,
            }
        );
    },
    createMissingReleaseCiData: () => {
        return axiosInstance.post('/release-ci-data/create-missing');
    },
    autoSyncCi: (data?: { ids?: string[] }) => {
        return axiosInstance.post('/release-ci-data/bulk-sync-data-ci', data);
    },
    exportReleaseCiData: (data?: ReleaseCiDataFilter) => {
        return axiosInstance.post('/release-ci-data/export', data, {
            responseType: 'blob',
        });
    },
    getReleaseCiDataDetail: (id: string) => {
        return axiosInstance.get<DetailResponse<ReleaseCiData>>(
            `/release-ci-data/${id}`
        );
    },
    getReleaseCiDataDetailByReleaseId: (releaseId: string) => {
        return axiosInstance.get<DetailResponse<ReleaseCiData>>(
            `/release-ci-data/release/${releaseId}`
        );
    },
};
