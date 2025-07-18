import axiosAuth from '@/api/axios-auth';
import { ArtistDataFilter } from '@/modules/artist/types';
import { DetailResponse, PaginationResponse } from '@/types/api';
import { TrackTypeData } from '../types';
import {
    CreateTrackTypePayload,
    UpdateTrackTypePayload,
} from '../types/payload';

export const trackTypeApi = {
    getList: (params: ArtistDataFilter) => {
        return axiosAuth.get<PaginationResponse<TrackTypeData>>(
            '/track-types',
            {
                params,
            }
        );
    },

    getDetail: (id: TrackTypeData['id']) => {
        return axiosAuth.get<DetailResponse<TrackTypeData>>(
            `/track-types/${id}`
        );
    },

    createTrackType: (payload: CreateTrackTypePayload) => {
        return axiosAuth.post<DetailResponse<TrackTypeData>>(
            '/track-types',
            payload
        );
    },

    updateTrackType: (
        id: TrackTypeData['id'],
        payload: UpdateTrackTypePayload
    ) => {
        return axiosAuth.put<DetailResponse<TrackTypeData>>(
            `/track-types/${id}`,
            payload
        );
    },

    deleteTrackType: (id: TrackTypeData['id']) => {
        return axiosAuth.delete(`/track-types/${id}`);
    },
};
