import axiosAuth from '@/api/axios-auth';
import { DetailResponse, PaginationResponse } from '@/types/api';
import { ArtistData, ArtistDataFilter } from '../types';
import { CreateArtistPayload, UpdateArtistPayload } from '../types/payload';

export const artistApi = {
    getList: (params: ArtistDataFilter) => {
        return axiosAuth.get<PaginationResponse<ArtistData>>('/artists', {
            params,
        });
    },

    getDetail: (id: ArtistData['id']) => {
        return axiosAuth.get<DetailResponse<ArtistData>>(`/artists/${id}`);
    },

    createArtist: (payload: CreateArtistPayload) => {
        return axiosAuth.post<DetailResponse<ArtistData>>('/artists', payload);
    },

    updateArtist: (id: ArtistData['id'], payload: UpdateArtistPayload) => {
        return axiosAuth.put<DetailResponse<ArtistData>>(
            `/artists/${id}`,
            payload
        );
    },

    deleteArtist: (id: ArtistData['id']) => {
        return axiosAuth.delete(`/artists/${id}`);
    },
};
