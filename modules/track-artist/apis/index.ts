import axiosAuth from '@/api/axios-auth';
import { DetailResponse } from '@/types/api';
import { TrackArtistData } from '../types';
import {
    CreateTrackArtistPayload,
    UpdateTrackArtistPayload,
} from '../types/payload';

export const trackArtistApi = {
    createTrackArtist: (payload: CreateTrackArtistPayload) => {
        return axiosAuth.post<DetailResponse<TrackArtistData>>(
            '/track-artists',
            payload
        );
    },

    updateTrackArtist: (
        id: TrackArtistData['id'],
        payload: UpdateTrackArtistPayload
    ) => {
        return axiosAuth.put<DetailResponse<TrackArtistData>>(
            `/track-artists/${id}`,
            payload
        );
    },

    deleteTrackArtist: (id: TrackArtistData['id']) => {
        return axiosAuth.delete(`/track-artists/${id}`);
    },
};
