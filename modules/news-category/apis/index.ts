import axiosInstance from '@/api/axios-auth';
import { DetailResponse, PaginationResponse } from '@/types/api';
import { NewsCategoryData, NewsCategoryDataFilter } from '../types';
import {
    BulkUpdateNewsCategoryPayload,
    CreateNewsCategoryPayload,
    UpdateNewsCategoryPayload,
} from '../types/payloads';

export const newsCategoryApis = {
    getList: (params: NewsCategoryDataFilter) => {
        return axiosInstance.get<PaginationResponse<NewsCategoryData>>(
            '/news-categories',
            {
                params,
            }
        );
    },

    getTree: () => {
        return axiosInstance.get<DetailResponse<NewsCategoryData[]>>(
            '/news-categories/tree'
        );
    },

    getDetail: (id: NewsCategoryData['id']) => {
        return axiosInstance.get<DetailResponse<NewsCategoryData>>(
            `/news-categories/${id}`
        );
    },

    create: (payload: CreateNewsCategoryPayload) => {
        return axiosInstance.post<DetailResponse<NewsCategoryData>>(
            '/news-categories',
            payload
        );
    },

    update: (
        id: NewsCategoryData['id'],
        payload: UpdateNewsCategoryPayload
    ) => {
        return axiosInstance.put<DetailResponse<NewsCategoryData>>(
            `news-categories/${id}`,
            payload
        );
    },

    bulkUpdate: (payload: BulkUpdateNewsCategoryPayload) => {
        return axiosInstance.put<DetailResponse<NewsCategoryData>>(
            `news-categories/bulk`,
            payload
        );
    },

    delete: (id: NewsCategoryData['id']) => {
        return axiosInstance.delete(`/news-categories/${id}`);
    },
};
