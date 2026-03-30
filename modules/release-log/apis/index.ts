import axiosInstance from '@/api/axios-auth';
import { PaginationResponse } from '@/types/api';
import { ReleaseLogData, ReleaseLogFilter } from '../types';

export const releaseLogApis = {
    getListReleaseLog: (params: ReleaseLogFilter) => {
        return axiosInstance.get<PaginationResponse<ReleaseLogData>>(
            '/release-logs',
            { params }
        );
    },
};
