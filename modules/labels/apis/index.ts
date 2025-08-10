import axiosInstance from '@/api/axios-auth';
import { DetailResponse, PaginationResponse } from '@/types/api';
import { LabelData, LabelDataFilter } from '../types';
import { CreateLabelPayload, UpdateLabelPayload } from '../types/payload';

export const labelsApi = {
    getList: (params: LabelDataFilter) => {
        return axiosInstance.get<PaginationResponse<LabelData>>('/labels', {
            params,
        });
    },

    getDetail: (id: LabelData['id']) => {
        return axiosInstance.get<DetailResponse<LabelData>>(`/labels/${id}`);
    },

    createLabel: (payload: CreateLabelPayload) => {
        return axiosInstance.post<DetailResponse<LabelData>>(
            '/labels',
            payload
        );
    },

    updateLabel: (id: LabelData['id'], payload: UpdateLabelPayload) => {
        return axiosInstance.put<DetailResponse<LabelData>>(
            `labels/${id}`,
            payload
        );
    },

    deleteLabel: (id: LabelData['id']) => {
        return axiosInstance.delete(`/labels/${id}`);
    },
};
