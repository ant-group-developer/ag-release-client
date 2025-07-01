import axiosAuth from '@/api/axios-auth';
import { DetailResponse, PaginationResponse } from '@/types/api';
import { DspData, DspDataFilter } from '../types';
import { CreateDspPayload, UpdateDspPayload } from '../types/payload';

export const dspApi = {
    getList: (params: DspDataFilter) => {
        return axiosAuth.get<PaginationResponse<DspData>>('/dsps', { params });
    },
    getDetail: (id: DspData['id']) => {
        return axiosAuth.get<DetailResponse<DspData>>(`/dsps/${id}`);
    },
    createDsp: (payload: CreateDspPayload) => {
        return axiosAuth.post<DetailResponse<CreateDspPayload>>(
            `/dsps`,
            payload
        );
    },
    updateDsp: (id: DspData['id'], payload: UpdateDspPayload) => {
        return axiosAuth.put<DetailResponse<UpdateDspPayload>>(
            `/dsps/${id}`,
            payload
        );
    },
    deleteDsp: (id: DspData['id']) => {
        return axiosAuth.delete(`/dsps/${id}`);
    },
};
