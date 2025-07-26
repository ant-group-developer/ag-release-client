import axiosAuth from '@/api/axios-auth';
import { DetailResponse, PaginationResponse } from '@/types/api';
import { LanguageDataFilter, LanguagesData } from '../types';
import { CreateLanguagePayload, UpdateLanguagePayload } from '../types/payload';

export const languageApi = {
    getList: (params: LanguageDataFilter) => {
        return axiosAuth.get<PaginationResponse<LanguagesData>>('/languages', {
            params,
        });
    },

    getDetail: (id: LanguagesData['id']) => {
        return axiosAuth.get<DetailResponse<LanguagesData>>(`/languages/${id}`);
    },

    createLanguage: (payload: CreateLanguagePayload) => {
        return axiosAuth.post<DetailResponse<LanguagesData>>(
            '/languages',
            payload
        );
    },

    updateLanguage: (
        id: LanguagesData['id'],
        payload: UpdateLanguagePayload
    ) => {
        return axiosAuth.put(`/languages/${id}`, payload);
    },

    deleteLanguage: (id: LanguagesData['id']) => {
        return axiosAuth.delete(`/languages/${id}`);
    },
};
