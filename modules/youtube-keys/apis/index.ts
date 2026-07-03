import axiosInstance from '@/api/axios-auth';
import { DetailResponse } from '@/types/api';
import {
    YoutubeKeyData,
    YoutubeKeyDataFilter,
    CreateYoutubeKeyPayload,
    UpdateYoutubeKeyPayload,
} from '../types';

export const youtubeKeysApi = {
    getList: (params?: YoutubeKeyDataFilter) => {
        return axiosInstance.get<DetailResponse<YoutubeKeyData[]>>(
            '/admin/youtube-api-keys',
            {
                params,
            }
        );
    },
    create: (payload: CreateYoutubeKeyPayload) => {
        return axiosInstance.post('/admin/youtube-api-keys', payload);
    },
    getDetail: (id: string | number) => {
        return axiosInstance.get<DetailResponse<YoutubeKeyData>>(
            `/admin/youtube-api-keys/${id}`
        );
    },
    update: (id: string | number, payload: UpdateYoutubeKeyPayload) => {
        return axiosInstance.patch(`/admin/youtube-api-keys/${id}`, payload);
    },
};
