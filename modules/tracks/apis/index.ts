import axiosAuth from '@/api/axios-auth';
import { DetailResponse, PaginationResponse } from '@/types/api';
import { TrackData, TrackDataFilter } from '../types';
import { TrackPayload, UpdateTrackPayload } from '../types/payload';

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

    getListTrack: (params: TrackDataFilter) => {
        return axiosAuth.get<PaginationResponse<TrackData>>(`/tracks`, {
            params,
        });
    },

    deleteTrack: (id: TrackData['id']) => {
        return axiosAuth.delete(`/tracks/${id}`);
    },
};
