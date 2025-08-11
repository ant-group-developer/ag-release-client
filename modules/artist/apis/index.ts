import axiosInstance from '@/api/axios-auth';
import { DetailResponse, PaginationResponse } from '@/types/api';
import { ArtistData, ArtistDataFilter } from '../types';
import {
    CreateArtistPayload,
    DeleteArtistProfiles,
    UpdateArtistPayload,
} from '../types/payload';

export const artistApi = {
    getList: (params: ArtistDataFilter) => {
        return axiosInstance.get<PaginationResponse<ArtistData>>('/artists', {
            params,
        });
    },

    getDetail: (id: ArtistData['id']) => {
        return axiosInstance.get<DetailResponse<ArtistData>>(`/artists/${id}`);
    },

    createArtist: (payload: CreateArtistPayload) => {
        return axiosInstance.post<DetailResponse<ArtistData>>(
            '/artists',
            payload
        );
    },

    updateArtist: (id: ArtistData['id'], payload: UpdateArtistPayload) => {
        return axiosInstance.put<DetailResponse<ArtistData>>(
            `/artists/${id}`,
            payload
        );
    },

    deleteArtist: (id: ArtistData['id']) => {
        return axiosInstance.delete(`/artists/${id}`);
    },

    deleteArtistProfiles: ({ artistId, profileId }: DeleteArtistProfiles) => {
        return axiosInstance.delete(
            `/artists/${artistId}/artist-profiles/${profileId}`
        );
    },
};
