import axiosInstance from '@/api/axios-auth';
import { ReleasesData } from '@/modules/releases/types';
import { PaginationResponse } from '@/types/api';
import { ReleaseDspData, ReleaseDspDataFilter } from '../types';
import { ReleaseDspBulkUpdate } from '../types/payloads';

export const releaseDspApis = {
    getListDspDistribute: (
        id: ReleasesData['id'],
        params?: ReleaseDspDataFilter
    ) => {
        return axiosInstance.post<PaginationResponse<ReleaseDspData>>(
            `/release-dsp-deliveries/sync-and-get/release/${id}`,
            null,
            { params }
        );
    },
    bulkUpdate: (items: ReleaseDspBulkUpdate['items']) => {
        return axiosInstance.put<PaginationResponse<ReleaseDspData>>(
            `/release-dsp-deliveries/bulk`,
            { items }
        );
    },
};
