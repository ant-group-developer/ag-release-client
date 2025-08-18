import axiosInstance from '@/api/axios-auth';
import { DetailResponse, PaginationResponse } from '@/types/api';
import { ActionsData, ActionsDataFilter } from '../types';
import { CreateActionPayload, UpdateActionPayload } from '../types/payload';

export const actionsApis = {
    getList: (params: ActionsDataFilter) => {
        return axiosInstance.get<PaginationResponse<ActionsData>>('/actions', {
            params,
        });
    },

    getDetail: (id: ActionsData['id']) => {
        return axiosInstance.get<DetailResponse<ActionsData>>(`/actions/${id}`);
    },

    createAction: (payload: CreateActionPayload) => {
        return axiosInstance.post<DetailResponse<ActionsData>>(
            '/actions',
            payload
        );
    },

    updateAction: (id: ActionsData['id'], payload: UpdateActionPayload) => {
        return axiosInstance.put<DetailResponse<ActionsData>>(
            `/actions/${id}`,
            payload
        );
    },

    deleteAction: (id: ActionsData['id']) => {
        return axiosInstance.delete(`/actions/${id}`);
    },
};
