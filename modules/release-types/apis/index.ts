import axiosInstance from '@/api/axios-auth';
import { DetailResponse, PaginationResponse } from '@/types/api';
import { ReleaseTypesData, ReleaseTypesDataFilter } from '../types';
import {
    CreateReleaseTypePayload,
    UpdateReleaseTypePayload,
} from '../types/payload';

export const releaseTypesApi = {
    getList: (params: ReleaseTypesDataFilter) => {
        return axiosInstance.get<PaginationResponse<ReleaseTypesData>>(
            '/album-formats',
            {
                params,
            }
        );
    },

    getDetail: (id: ReleaseTypesData['id']) => {
        return axiosInstance.get<DetailResponse<ReleaseTypesData>>(
            `/album-formats/${id}`
        );
    },

    createReleaseType: (payload: CreateReleaseTypePayload) => {
        return axiosInstance.post<DetailResponse<ReleaseTypesData>>(
            '/album-formats',
            payload
        );
    },

    updateReleaseType: (
        id: ReleaseTypesData['id'],
        payload: UpdateReleaseTypePayload
    ) => {
        return axiosInstance.put<DetailResponse<ReleaseTypesData>>(
            `/album-formats/${id}`,
            payload
        );
    },

    deleteReleaseType: (id: ReleaseTypesData['id']) => {
        return axiosInstance.delete(`/album-formats/${id}`);
    },
};
