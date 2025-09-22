import axiosInstance from '@/api/axios-auth';
import { DetailResponse, PaginationResponse } from '@/types/api';
import { NewsData, NewsDataFilter } from '../types';
import { CreateNewsPayload, UpdateNewsPayload } from '../types/payloads';

export const newsApis = {
    getList: (params: NewsDataFilter) => {
        return axiosInstance.get<PaginationResponse<NewsData>>('/news-posts', {
            params,
        });
    },

    getDetail: (id: NewsData['id']) => {
        return axiosInstance.get<DetailResponse<NewsData>>(`/news-posts/${id}`);
    },

    getKeywords: () => {
        return axiosInstance.get<DetailResponse<string[]>>(
            '/news-posts/keywords'
        );
    },

    create: (payload: CreateNewsPayload) => {
        return axiosInstance.post<DetailResponse<NewsData>>(
            '/news-posts',
            payload
        );
    },

    update: (id: NewsData['id'], payload: UpdateNewsPayload) => {
        return axiosInstance.put<DetailResponse<NewsData>>(
            `news-posts/${id}`,
            payload
        );
    },

    delete: (id: NewsData['id']) => {
        return axiosInstance.delete(`/news-posts/${id}`);
    },
};
