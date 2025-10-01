import axiosInstance from '@/api/axios-auth';
import { DetailResponse, PaginationResponse } from '@/types/api';
import { NewsData, NewsDataFilter, TranslationData } from '../types';
import {
    CreateNewsPayload,
    CreateTranslationPayload,
    UpdateNewsPayload,
} from '../types/payloads';

export const newsApis = {
    getList: (params: NewsDataFilter) => {
        return axiosInstance.get<PaginationResponse<NewsData>>('/news-posts', {
            params,
        });
    },

    getListPublic: (params: NewsDataFilter) => {
        return axiosInstance.get<PaginationResponse<NewsData>>(
            '/news-posts/public',
            {
                params,
            }
        );
    },

    getListNewsWithTranslate: (newsId: string) => {
        return axiosInstance.get<DetailResponse<NewsData[]>>(
            `/news-posts/${newsId}/translations`
        );
    },

    getDetail: (id: NewsData['id']) => {
        return axiosInstance.get<DetailResponse<NewsData>>(`/news-posts/${id}`);
    },

    getDetailBySlug: (slug: NewsData['slug']) => {
        return axiosInstance.get<DetailResponse<NewsData>>(
            `/news-posts/public/${slug}`
        );
    },

    getDetailTranslation: (
        newsId: NewsData['id'],
        translationId: TranslationData['id']
    ) => {
        return axiosInstance.get<DetailResponse<TranslationData>>(
            `/news-posts/${newsId}/translations/${translationId}`
        );
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

    createTranslate: (newsId: string, payload: CreateTranslationPayload) => {
        return axiosInstance.post<DetailResponse<TranslationData>>(
            `/news-posts/${newsId}/add-translation`,
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
