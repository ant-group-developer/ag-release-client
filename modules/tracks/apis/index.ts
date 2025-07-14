import axiosAuth from '@/api/axios-auth';
import { DetailResponse, PaginationResponse } from '@/types/api';
import { TrackData, TrackDataFilter } from '../types';
import { trackPayload } from '../types/payload';

export const trackApi = {
    createTrackDraft: (payload: { trackDrafts: trackPayload[] }) => {
        return axiosAuth.post<DetailResponse<TrackData[]>>(
            '/tracks/draft/bulk',
            payload
        );
    },

    getListTrack: (params: TrackDataFilter) => {
        return axiosAuth.get<PaginationResponse<TrackData>>(`/tracks`, {
            params,
        });
    },
};
