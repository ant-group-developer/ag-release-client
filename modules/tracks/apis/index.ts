import axiosAuth from '@/api/axios-auth';
import { DetailResponse, PaginationResponse } from '@/types/api';
import { TrackData, TrackDataFilter } from '../types';
import {
    TrackPayload,
    UpdateTrackOrderPayload,
    UpdateTrackPayload,
} from '../types/payload';

export const trackApi = {
    createTrackDraft: (payload: { trackDrafts: TrackPayload[] }) => {
        return axiosAuth.post<DetailResponse<TrackData[]>>(
            '/tracks/draft/bulk',
            payload
        );
    },

    updateTrackDraft: (id: TrackData['id'], payload: UpdateTrackPayload) => {
        return axiosAuth.put<DetailResponse<TrackData[]>>(
            `/tracks/draft/${id}`,
            payload
        );
    },

    updateTrackOrder: (payload: UpdateTrackOrderPayload) => {
        return axiosAuth.put(`/tracks/draft/bulk`, payload);
    },

    getListTrack: (params: TrackDataFilter) => {
        return axiosAuth.get<PaginationResponse<TrackData>>(`/tracks`, {
            params,
        });
    },

    getDetailTrack: (id: TrackData['id']) => {
        return axiosAuth.get<DetailResponse<TrackData>>(`/tracks/${id}`);
    },

    deleteTrackDraft: (id: TrackData['id']) => {
        return axiosAuth.delete(`/tracks/draft/${id}`);
    },
};
