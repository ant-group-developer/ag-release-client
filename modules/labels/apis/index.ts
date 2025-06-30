import axiosAuth from '@/api/axios-auth';
import { DetailResponse, PaginationResponse } from '@/types/api';
import { LabelData, LabelDataFilter } from '../types';
import { CreateLabelPayload, UpdateLabelPayload } from '../types/payload';

export const labelsApi = {
    getList: (params: LabelDataFilter) => {
        return axiosAuth.get<PaginationResponse<LabelData>>('/labels', {
            params,
        });
    },

    getDetail: (id: LabelData['id']) => {
        return axiosAuth.get<DetailResponse<LabelData>>(`/labels/${id}`);
    },

    createLabel: (payload: CreateLabelPayload) => {
        return axiosAuth.post<DetailResponse<LabelData>>('/labels', payload);
    },

    updateLabel: (id: LabelData['id'], payload: UpdateLabelPayload) => {
        return axiosAuth.put<DetailResponse<LabelData>>(
            `labels/${id}`,
            payload
        );
    },

    deleteLabel: (id: LabelData['id']) => {
        return axiosAuth.delete(`/labels/${id}`);
    },
};
