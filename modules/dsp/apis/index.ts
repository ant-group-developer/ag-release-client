import axiosInstance from '@/api/axios-auth';
import { DetailResponse, PaginationResponse } from '@/types/api';
import { DspData, DspDataFilter } from '../types';
import {
    CreateDspPayload,
    DeleteDspAction,
    UpdateDspPayload,
} from '../types/payload';

export const dspApi = {
    getList: (params: DspDataFilter) => {
        return axiosInstance.get<PaginationResponse<DspData>>('/dsps', {
            params,
        });
    },
    getDetail: (id: DspData['id']) => {
        return axiosInstance.get<DetailResponse<DspData>>(`/dsps/${id}`);
    },
    createDsp: (payload: CreateDspPayload) => {
        return axiosInstance.post<DetailResponse<CreateDspPayload>>(
            `/dsps`,
            payload
        );
    },
    updateDsp: (id: DspData['id'], payload: UpdateDspPayload) => {
        return axiosInstance.put<DetailResponse<UpdateDspPayload>>(
            `/dsps/${id}`,
            payload
        );
    },
    deleteDsp: (id: DspData['id']) => {
        return axiosInstance.delete(`/dsps/${id}`);
    },

    deleteDspAction: ({ dspId, actionId }: DeleteDspAction) => {
        return axiosInstance.delete(`/dsps/${dspId}/dsp-actions/${actionId}`);
    },
};
