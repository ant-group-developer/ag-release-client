import axiosAuth from '@/api/axios-auth';
import { DetailResponse, PaginationResponse } from '@/types/api';
import { ReleasesData, ReleasesDataFilter } from '../types';
import {
    CreateReleaseDraftPayload,
    UpdateReleaseDraftPayload,
} from '../types/payload';

export const releasesApi = {
    getList: (params: ReleasesDataFilter) => {
        return axiosAuth.get<PaginationResponse<ReleasesData>>('/releases', {
            params,
        });
    },
    getDetail: (id: ReleasesData['id']) => {
        return axiosAuth.get<DetailResponse<ReleasesData>>(`/releases/${id}`);
    },

    createReleaseDraft: (payload: CreateReleaseDraftPayload) => {
        return axiosAuth.post<DetailResponse<ReleasesData>>(
            '/releases/draft',
            payload
        );
    },

    updateReleaseDraft: (
        id: ReleasesData['id'],
        payload: UpdateReleaseDraftPayload
    ) => {
        return axiosAuth.put<DetailResponse<ReleasesData>>(
            `/releases/draft/${id}`,
            payload
        );
    },

    deleteRelease: (id: ReleasesData['id']) => {
        return axiosAuth.delete(`/releases/draft/${id}`);
    },
};
