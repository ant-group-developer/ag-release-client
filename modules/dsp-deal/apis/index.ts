import axiosInstance from '@/api/axios-auth';
import { DspData } from '@/modules/dsp/types';
import { DetailResponse, PaginationResponse } from '@/types/api';
import { DspDealData, DspDealDataFilter } from '../types';
import { CreateDspDealPayload, UpdateDspDealPayload } from '../types/payload';

export const dspDealApis = {
    getList: (dspId: DspData['id'], params: DspDealDataFilter) => {
        return axiosInstance.get<PaginationResponse<DspDealData>>(
            `/distribution/${dspId}/deals`,
            {
                params,
            }
        );
    },

    getDetail: (dspId: DspData['id'], id: DspDealData['id']) => {
        return axiosInstance.get<DetailResponse<DspDealData>>(
            `/distribution/${dspId}/deals/${id}`
        );
    },

    create: (dspId: DspData['id'], payload: CreateDspDealPayload) => {
        return axiosInstance.post<DetailResponse<DspDealData>>(
            `/distribution/${dspId}/deals`,
            payload
        );
    },

    update: (id: DspDealData['id'], payload: UpdateDspDealPayload) => {
        return axiosInstance.put<DetailResponse<DspDealData>>(
            `/distribution/deal-types/${id}`,
            payload
        );
    },

    delete: (id: DspDealData['id']) => {
        return axiosInstance.delete(`/distribution/deal-types/${id}`);
    },
};
