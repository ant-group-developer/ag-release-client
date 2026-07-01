import axiosInstance from '@/api/axios-auth';
import { PaginationResponse } from '@/types/api';
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
        return axiosInstance.get<ReleaseCiData>(`/release-ci-data/${id}`);
    },
};
