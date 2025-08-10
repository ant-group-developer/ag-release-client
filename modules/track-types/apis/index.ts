import axiosInstance from '@/api/axios-auth';
import { ArtistDataFilter } from '@/modules/artist/types';
import { DetailResponse, PaginationResponse } from '@/types/api';
import { TrackTypeData } from '../types';
import {
    CreateTrackTypePayload,
    UpdateTrackTypePayload,
} from '../types/payload';

export const trackTypeApi = {
    getList: (params: ArtistDataFilter) => {
        return axiosInstance.get<PaginationResponse<TrackTypeData>>(
            '/track-types',
            {
                params,
            }
        );
    },

    getDetail: (id: TrackTypeData['id']) => {
        return axiosInstance.get<DetailResponse<TrackTypeData>>(
            `/track-types/${id}`
        );
    },

    createTrackType: (payload: CreateTrackTypePayload) => {
        return axiosInstance.post<DetailResponse<TrackTypeData>>(
            '/track-types',
            payload
        );
    },

    updateTrackType: (
        id: TrackTypeData['id'],
        payload: UpdateTrackTypePayload
    ) => {
        return axiosInstance.put<DetailResponse<TrackTypeData>>(
            `/track-types/${id}`,
            payload
        );
    },

    deleteTrackType: (id: TrackTypeData['id']) => {
        return axiosInstance.delete(`/track-types/${id}`);
    },
};
