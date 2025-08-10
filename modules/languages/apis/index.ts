import axiosInstance from '@/api/axios-auth';
import { DetailResponse, PaginationResponse } from '@/types/api';
import { LanguageDataFilter, LanguagesData } from '../types';
import { CreateLanguagePayload, UpdateLanguagePayload } from '../types/payload';

export const languageApi = {
    getList: (params: LanguageDataFilter) => {
        return axiosInstance.get<PaginationResponse<LanguagesData>>(
            '/languages',
            {
                params,
            }
        );
    },

    getDetail: (id: LanguagesData['id']) => {
        return axiosInstance.get<DetailResponse<LanguagesData>>(
            `/languages/${id}`
        );
    },

    createLanguage: (payload: CreateLanguagePayload) => {
        return axiosInstance.post<DetailResponse<LanguagesData>>(
            '/languages',
            payload
        );
    },

    updateLanguage: (
        id: LanguagesData['id'],
        payload: UpdateLanguagePayload
    ) => {
        return axiosInstance.put(`/languages/${id}`, payload);
    },

    deleteLanguage: (id: LanguagesData['id']) => {
        return axiosInstance.delete(`/languages/${id}`);
    },
};
