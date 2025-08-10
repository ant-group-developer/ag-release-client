import axiosInstance from '@/api/axios-auth';
import { DetailResponse, PaginationResponse } from '@/types/api';
import { TrackData, TrackDataFilter } from '../types';
import {
    TrackPayload,
    UpdateTrackOrderPayload,
    UpdateTrackPayload,
} from '../types/payload';

export const trackApi = {
    createTrackDraft: (payload: { trackDrafts: TrackPayload[] }) => {
        return axiosInstance.post<DetailResponse<TrackData[]>>(
            '/tracks/draft/bulk',
            payload
        );
    },

    updateTrackDraft: (id: TrackData['id'], payload: UpdateTrackPayload) => {
        return axiosInstance.put<DetailResponse<TrackData[]>>(
            `/tracks/draft/${id}`,
            payload
        );
    },

    updateTrackOrder: (payload: UpdateTrackOrderPayload) => {
        return axiosInstance.put(`/tracks/draft/bulk`, payload);
    },

    getListTrack: (params: TrackDataFilter) => {
        return axiosInstance.get<PaginationResponse<TrackData>>(`/tracks`, {
            params,
        });
    },

    getDetailTrack: (id: TrackData['id']) => {
        return axiosInstance.get<DetailResponse<TrackData>>(`/tracks/${id}`);
    },

    deleteTrackDraft: (id: TrackData['id']) => {
        return axiosInstance.delete(`/tracks/draft/${id}`);
    },
};
