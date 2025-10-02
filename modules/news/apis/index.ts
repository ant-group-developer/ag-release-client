import axiosInstance from '@/api/axios-auth';
import { DetailResponse, PaginationResponse } from '@/types/api';
import { NewsData, NewsDataFilter, TranslationData } from '../types';
import {
    CreateNewsPayload,
    CreateTranslationPayload,
    UpdateNewsPayload,
    UpdateTranslationPayload,
} from '../types/payloads';

export const newsApis = {
    getList: (params: NewsDataFilter) => {
        return axiosInstance.get<PaginationResponse<NewsData>>(`/news-posts`, {
            params,
            headers: {
                locale: params?.languageCode,
            },
        });
    },

    getListPublic: (params: NewsDataFilter) => {
        return axiosInstance.get<PaginationResponse<NewsData>>(
            '/news-posts/public',
            {
                params,
                headers: {
                    locale: params?.languageCode,
                },
            }
        );
    },

    getListTranslations: (newsId: string) => {
        return axiosInstance.get<DetailResponse<TranslationData[]>>(
            `/news-posts/${newsId}/translations`
        );
    },

    getDetail: (id: NewsData['id']) => {
        return axiosInstance.get<DetailResponse<NewsData>>(`/news-posts/${id}`);
    },

    getDetailBySlug: (locale: string, slug: NewsData['slug']) => {
        return axiosInstance.get<DetailResponse<NewsData>>(
            `/news-posts/public/${slug}`,
            {
                headers: {
                    locale: locale,
                },
            }
        );
    },

    getDetailTranslation: (translationId: TranslationData['id']) => {
        return axiosInstance.get<DetailResponse<TranslationData>>(
            `/news-posts/translations/${translationId}`
        );
    },

    getOriginalTranslation: (newsId: NewsData['id']) => {
        return axiosInstance.get<DetailResponse<TranslationData>>(
            `/news-posts/${newsId}/translations/default`
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

    createTranslate: (payload: CreateTranslationPayload) => {
        return axiosInstance.post<DetailResponse<TranslationData>>(
            `/news-posts/translations`,
            payload
        );
    },

    update: (id: NewsData['id'], payload: UpdateNewsPayload) => {
        return axiosInstance.put<DetailResponse<NewsData>>(
            `/news-posts/${id}`,
            payload
        );
    },

    updateTranslation: (
        id: TranslationData['id'],
        payload: UpdateTranslationPayload
    ) => {
        return axiosInstance.put<DetailResponse<TranslationData>>(
            `/news-posts/translations/${id}`,
            payload
        );
    },

    delete: (id: NewsData['id']) => {
        return axiosInstance.delete(`/news-posts/${id}`);
    },

    deleteTranslation: (translationId: TranslationData['id']) => {
        return axiosInstance.delete(
            `/news-posts/translations/${translationId}`
        );
    },
};
