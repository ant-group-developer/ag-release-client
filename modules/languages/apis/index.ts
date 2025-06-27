import axiosAuth from '@/api/axios-auth';
import { DetailResponse, PaginationResponse } from '@/types/api';
import { LanguageDataFilter, LanguagesData } from '../types';
import { CreateLanguagePayload, UpdateLanguagePayload } from '../types/payload';

export const languageApi = {
    getList: (params: LanguageDataFilter) => {
        return axiosAuth.get<PaginationResponse<LanguagesData>>('/language', {
            params,
        });
    },

    getDetail: (id: LanguagesData['id']) => {
        return axiosAuth.get<DetailResponse<LanguagesData>>(`/language/${id}`);
    },

    createLanguage: (payload: CreateLanguagePayload) => {
        return axiosAuth.post<DetailResponse<LanguagesData>>(
            '/language',
            payload
        );
    },

    updateLanguage: (
        id: LanguagesData['id'],
        payload: UpdateLanguagePayload
    ) => {
        return axiosAuth.patch(`/language/${id}`, payload);
    },

    deleteLanguage: (id: LanguagesData['id']) => {
        return axiosAuth.delete(`/language/${id}`);
    },
};
