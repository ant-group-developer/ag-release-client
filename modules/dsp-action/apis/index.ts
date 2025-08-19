import axiosInstance from '@/api/axios-auth';
import { DspData } from '@/modules/dsp/types';
import { DetailResponse, PaginationResponse } from '@/types/api';
import { DspActionData, DspActionDataFilter } from '../types';

export const dspActionApis = {
    getListActionByDspId: (id: DspData['id']) => {
        return axiosInstance.get<DetailResponse<DspActionData[]>>(
            `/dsps/${id}/dsp-actions`
        );
    },
    getListDspAction: (params: DspActionDataFilter) => {
        return axiosInstance.get<PaginationResponse<DspData[]>>(
            `/dsps/with-actions`,
            { params }
        );
    },
};
