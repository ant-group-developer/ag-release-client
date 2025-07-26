import axiosAuth from '@/api/axios-auth';
import { ArtistDataFilter } from '@/modules/artist/types';
import { DetailResponse, PaginationResponse } from '@/types/api';
import { TrackOriginTypeData } from '../types';
import {
    CreateTrackOriginTypePayload,
    UpdateTrackOriginTypePayload,
} from '../types/payload';

export const trackOriginTypeApi = {
    getList: (params: ArtistDataFilter) => {
        return axiosAuth.get<PaginationResponse<TrackOriginTypeData>>(
            '/track-origin-types',
            {
                params,
            }
        );
    },

    getDetail: (id: TrackOriginTypeData['id']) => {
        return axiosAuth.get<DetailResponse<TrackOriginTypeData>>(
            `/track-types/${id}`
        );
    },

    createTrackOriginType: (payload: CreateTrackOriginTypePayload) => {
        return axiosAuth.post<DetailResponse<TrackOriginTypeData>>(
            '/track-origin-types',
            payload
        );
    },

    updateTrackOriginType: (
        id: TrackOriginTypeData['id'],
        payload: UpdateTrackOriginTypePayload
    ) => {
        return axiosAuth.put<DetailResponse<TrackOriginTypeData>>(
            `/track-origin-types/${id}`,
            payload
        );
    },

    deleteTrackOriginType: (id: TrackOriginTypeData['id']) => {
        return axiosAuth.delete(`/track-origin-types/${id}`);
    },
};
