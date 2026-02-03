import axiosInstance from '@/api/axios-auth';
import { DetailResponse, PaginationResponse } from '@/types/api';
import {
    ReleasesData,
    ReleasesDataFilter,
    ReleasesDataSimple,
    ReleaseValidate,
} from '../types';
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

    getListSimple: (params: ReleasesDataFilter) => {
        return axiosInstance.get<PaginationResponse<ReleasesDataSimple>>(
            '/releases/simple',
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

    downloadAssets: (id: ReleasesData['id']) => {
        return axiosInstance.get(`/releases/${id}/download/assets`, {
            responseType: 'blob',
        });
    },

    downloadCoverArt: (id: ReleasesData['id']) => {
        return axiosInstance.get(`/releases/${id}/download/cover-art`, {
            responseType: 'blob',
        });
    },

    downloadCsvMetadata: (id: ReleasesData['id']) => {
        return axiosInstance.get(`/releases/${id}/download/csv-metadata`, {
            responseType: 'blob',
        });
    },

    downloadXlsxMetadata: (id: ReleasesData['id']) => {
        return axiosInstance.get(`/releases/${id}/download/xlsx-metadata`, {
            responseType: 'blob',
        });
    },

    downloadTxtMetadata: (id: ReleasesData['id']) => {
        return axiosInstance.get(`/releases/${id}/download/txt-metadata`, {
            responseType: 'blob',
        });
    },
};
