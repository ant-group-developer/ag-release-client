import axiosAuth from '@/api/axios-auth';
import { ArtistDataFilter } from '@/modules/artist/types';
import { DetailResponse, PaginationResponse } from '@/types/api';
import { ArtistRoleData } from '../types';
import {
    CreateArtistRolePayload,
    UpdateArtistRolePayload,
} from '../types/payload';

export const artistRoleApi = {
    getList: (params: ArtistDataFilter) => {
        return axiosAuth.get<PaginationResponse<ArtistRoleData>>(
            '/artist-roles',
            { params }
        );
    },

    getDetail: (id: ArtistRoleData['id']) => {
        return axiosAuth.get<DetailResponse<ArtistRoleData>>(
            `/artist-roles/${id}`
        );
    },

    createArtistRole: (payload: CreateArtistRolePayload) => {
        return axiosAuth.post<DetailResponse<ArtistRoleData>>(
            '/artist-roles',
            payload
        );
    },

    updateArtistRole: (
        id: ArtistRoleData['id'],
        payload: UpdateArtistRolePayload
    ) => {
        return axiosAuth.put<DetailResponse<ArtistRoleData>>(
            `/artist-roles/${id}`,
            payload
        );
    },

    deleteArtistRole: (id: ArtistRoleData['id']) => {
        return axiosAuth.delete(`/artist-roles/${id}`);
    },
};
