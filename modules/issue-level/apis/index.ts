import axiosInstance from '@/api/axios-auth';
import { DetailResponse, PaginationResponse } from '@/types/api';
import { IssueLevelData, IssueLevelDataFilter } from '../types';
import {
    BulkUpdateIssueLevelPayload,
    CreateIssueLevelPayload,
    UpdateIssueLevelPayload,
} from '../types/payloads';

export const issueLevelApis = {
    getList: (params: IssueLevelDataFilter) => {
        return axiosInstance.get<PaginationResponse<IssueLevelData>>(
            '/issue-levels',
            {
                params,
            }
        );
    },

    getListSimple: () => {
        return axiosInstance.get<DetailResponse<IssueLevelData[]>>(
            '/issue-levels/simple'
        );
    },

    getDetail: (id: IssueLevelData['id']) => {
        return axiosInstance.get<DetailResponse<IssueLevelData>>(
            `/issue-levels/${id}`
        );
    },

    create: (payload: CreateIssueLevelPayload) => {
        return axiosInstance.post<DetailResponse<IssueLevelData>>(
            '/issue-levels',
            payload
        );
    },

    update: (id: IssueLevelData['id'], payload: UpdateIssueLevelPayload) => {
        return axiosInstance.put<DetailResponse<IssueLevelData>>(
            `issue-levels/${id}`,
            payload
        );
    },

    bulkUpdate: (payload: BulkUpdateIssueLevelPayload) => {
        return axiosInstance.put<DetailResponse<IssueLevelData>>(
            `issue-levels/bulk`,
            payload
        );
    },

    delete: (id: IssueLevelData['id']) => {
        return axiosInstance.delete(`/issue-levels/${id}`);
    },
};
