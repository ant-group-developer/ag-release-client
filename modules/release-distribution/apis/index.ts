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
    autoSyncCi: () => {
        return axiosInstance.post('/release-ci-data/bulk-sync-data-ci');
    },
    getReleaseCiDataDetail: (id: string) => {
        return axiosInstance.get<DetailResponse<ReleaseCiData>>(
            `/release-ci-data/${id}`
        );
    },
};
