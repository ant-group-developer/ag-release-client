import axiosInstance from '@/api/axios-auth';
import { DetailResponse, PaginationResponse } from '@/types/api';
import { ReleasesData, ReleasesDataFilter, ReleaseValidate } from '../types';
import {
    CreateReleaseDraftPayload,
    UpdateReleaseDraftPayload,
} from '../types/payload';

export const releasesApi = {
    getList: (params: ReleasesDataFilter) => {
        return axiosInstance.get<PaginationResponse<ReleasesData>>(
            '/releases',
            {
                params,
            }
        );
    },
    getDetail: (id: ReleasesData['id']) => {
        return axiosInstance.get<DetailResponse<ReleasesData>>(
            `/releases/${id}`
        );
    },

    createReleaseDraft: (payload: CreateReleaseDraftPayload) => {
        return axiosInstance.post<DetailResponse<ReleasesData>>(
            '/releases/draft',
            payload
        );
    },

    updateReleaseDraft: (
        id: ReleasesData['id'],
        payload: UpdateReleaseDraftPayload
    ) => {
        return axiosInstance.put<DetailResponse<ReleasesData>>(
            `/releases/draft/${id}`,
            payload
        );
    },

    deleteRelease: (id: ReleasesData['id']) => {
        return axiosInstance.delete(`/releases/draft/${id}`);
    },

    validate: (id: ReleasesData['id']) => {
        {
            return axiosInstance.get<DetailResponse<ReleaseValidate[]>>(
                `/releases/draft/${id}/validate`
            );
        }
    },
};
