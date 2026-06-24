import axiosInstance from '@/api/axios-auth';
import { DetailResponse } from '@/types/api';
import { ReleaseArtist } from '../types';
import {
    CreateReleaseArtistPayload,
    UpdateReleaseArtistPayload,
    BulkCreateReleaseArtistPayload,
} from '../types/payload';

export const releaseArtistApi = {
    createReleaseArtist: (payload: CreateReleaseArtistPayload) => {
        return axiosInstance.post<DetailResponse<ReleaseArtist>>(
            '/release-artists',
            payload
        );
    },

    bulkCreateReleaseArtist: (payload: BulkCreateReleaseArtistPayload) => {
        return axiosInstance.post(
            '/release-artists/bulk',
            payload
        );
    },

    updateReleaseArtist: (
        id: ReleaseArtist['id'],
        payload: UpdateReleaseArtistPayload
    ) => {
        return axiosInstance.put<DetailResponse<ReleaseArtist>>(
            `/release-artists/${id}`,
            payload
        );
    },

    deleteReleaseArtist: (id: ReleaseArtist['id']) => {
        return axiosInstance.delete(`/release-artists/${id}`);
    },
};
