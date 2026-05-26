import axiosInstance from '@/api/axios-auth';
import { DetailResponse, PaginationResponse } from '@/types/api';
import { ReleaseVideoData, ReleaseVideoDataFilter } from '../types';
import { CreateReleaseVideoPayload, UpdateReleaseVideoPayload } from '../types/payload';

export const releaseVideoApi = {
    getList: (params: ReleaseVideoDataFilter) => {
        return axiosInstance.get<PaginationResponse<ReleaseVideoData>>('/release-videos', {
            params,
        });
    },

    getDetail: (id: ReleaseVideoData['id']) => {
        return axiosInstance.get<DetailResponse<ReleaseVideoData>>(`/release-videos/${id}`);
    },

    update: (id: ReleaseVideoData['id'], payload: UpdateReleaseVideoPayload) => {
        return axiosInstance.put<DetailResponse<ReleaseVideoData>>(`/release-videos/${id}`, payload);
    },

    create: (payload: CreateReleaseVideoPayload) => {
        return axiosInstance.post<DetailResponse<ReleaseVideoData>>('/release-videos', payload);
    },

    delete: (id: ReleaseVideoData['id']) => {
        return axiosInstance.delete(`/release-videos/${id}`);
    },
};
