import axiosInstance from '@/api/axios-auth';
import { ArtistDataFilter } from '@/modules/artist/types';
import { DetailResponse, PaginationResponse } from '@/types/api';
import { ArtistRoleData, ArtistRoleSimpleData } from '../types';
import {
    CreateArtistRolePayload,
    UpdateArtistRolePayload,
} from '../types/payload';

export const artistRoleApi = {
    getList: (params: ArtistDataFilter) => {
        return axiosInstance.get<PaginationResponse<ArtistRoleData>>(
            '/artist-roles',
            { params }
        );
    },

    getListSimple: () => {
        return axiosInstance.get<DetailResponse<ArtistRoleSimpleData[]>>(
            '/artist-roles/simple'
        );
    },

    getDetail: (id: ArtistRoleData['id']) => {
        return axiosInstance.get<DetailResponse<ArtistRoleData>>(
            `/artist-roles/${id}`
        );
    },

    createArtistRole: (payload: CreateArtistRolePayload) => {
        return axiosInstance.post<DetailResponse<ArtistRoleData>>(
            '/artist-roles',
            payload
        );
    },

    updateArtistRole: (
        id: ArtistRoleData['id'],
        payload: UpdateArtistRolePayload
    ) => {
        return axiosInstance.put<DetailResponse<ArtistRoleData>>(
            `/artist-roles/${id}`,
            payload
        );
    },

    deleteArtistRole: (id: ArtistRoleData['id']) => {
        return axiosInstance.delete(`/artist-roles/${id}`);
    },
};
