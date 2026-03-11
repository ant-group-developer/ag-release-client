import axiosInstance from '@/api/axios-auth';
import { ReleasesData } from '@/modules/releases/types';
import { ListResponse } from '@/types/api';
import { ReleaseDspData } from '../types';

export const releaseDspApis = {
    getListDspDistribute: (id: ReleasesData['id']) => {
        return axiosInstance.get<ListResponse<ReleaseDspData>>(
            `/releases/${id}/dsp/delivery`
        );
    },
};
