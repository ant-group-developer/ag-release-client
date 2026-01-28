import axiosInstance from '@/api/axios-auth';
import { DetailResponse, PaginationResponse } from '@/types/api';
import { DspData, DspDataFilter, DspRoutingConfig } from '../types';
import {
    CreateDspPayload,
    DeleteDspAction,
    UpdateDspPayload,
    UpdateDspRoutingConfig,
} from '../types/payload';

export const dspApi = {
    getList: (params: DspDataFilter) => {
        return axiosInstance.get<PaginationResponse<DspData>>('/dsps', {
            params,
        });
    },

    getListSimple: () => {
        return axiosInstance.get<DetailResponse<DspData[]>>('/dsps/simple');
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

    getListDspByEnablePolicy: () => {
        return axiosInstance.get<DetailResponse<DspData[]>>(
            '/dsps/enable-policy'
        );
    },

    getDspRoutingConfig: (id: DspData['id']) => {
        return axiosInstance.get<DetailResponse<DspRoutingConfig>>(
            `/distribution3/dsp-routing-configs/by-dsp/${id}`
        );
    },

    updateDspRoutingConfig: (payload: UpdateDspRoutingConfig) => {
        return axiosInstance.post<DetailResponse<DspRoutingConfig>>(
            `/distribution3/dsp-routing-configs`,
            payload
        );
    },
};
