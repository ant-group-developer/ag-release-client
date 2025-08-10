import axiosInstance from '@/api/axios-auth';
import { ArtistDataFilter } from '@/modules/artist/types';
import { DetailResponse, PaginationResponse } from '@/types/api';
import { TrackOriginTypeData } from '../types';
import {
    CreateTrackOriginTypePayload,
    UpdateTrackOriginTypePayload,
} from '../types/payload';

export const trackOriginTypeApi = {
    getList: (params: ArtistDataFilter) => {
        return axiosInstance.get<PaginationResponse<TrackOriginTypeData>>(
            '/track-origin-types',
            {
                params,
            }
        );
    },

    getDetail: (id: TrackOriginTypeData['id']) => {
        return axiosInstance.get<DetailResponse<TrackOriginTypeData>>(
            `/track-types/${id}`
        );
    },

    createTrackOriginType: (payload: CreateTrackOriginTypePayload) => {
        return axiosInstance.post<DetailResponse<TrackOriginTypeData>>(
            '/track-origin-types',
            payload
        );
    },

    updateTrackOriginType: (
        id: TrackOriginTypeData['id'],
        payload: UpdateTrackOriginTypePayload
    ) => {
        return axiosInstance.put<DetailResponse<TrackOriginTypeData>>(
            `/track-origin-types/${id}`,
            payload
        );
    },

    deleteTrackOriginType: (id: TrackOriginTypeData['id']) => {
        return axiosInstance.delete(`/track-origin-types/${id}`);
    },
};
