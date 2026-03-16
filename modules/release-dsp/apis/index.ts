import axiosInstance from '@/api/axios-auth';
import { ReleasesData } from '@/modules/releases/types';
import { PaginationResponse } from '@/types/api';
import { ReleaseDspData, ReleaseDspDataFilter } from '../types';

export const releaseDspApis = {
    getListDspDistribute: (
        id: ReleasesData['id'],
        params?: ReleaseDspDataFilter
    ) => {
        return axiosInstance.get<PaginationResponse<ReleaseDspData>>(
            `/releases/${id}/dsp/delivery`,
            { params }
        );
    },
};
