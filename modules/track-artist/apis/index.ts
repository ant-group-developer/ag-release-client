import axiosInstance from '@/api/axios-auth';
import { DetailResponse } from '@/types/api';
import { TrackArtistData } from '../types';
import {
    CreateTrackArtistPayload,
    UpdateTrackArtistPayload,
} from '../types/payload';

export const trackArtistApi = {
    createTrackArtist: (payload: CreateTrackArtistPayload) => {
        return axiosInstance.post<DetailResponse<TrackArtistData>>(
            '/track-artists',
            payload
        );
    },

    updateTrackArtist: (
        id: TrackArtistData['id'],
        payload: UpdateTrackArtistPayload
    ) => {
        return axiosInstance.put<DetailResponse<TrackArtistData>>(
            `/track-artists/${id}`,
            payload
        );
    },

    deleteTrackArtist: (id: TrackArtistData['id']) => {
        return axiosInstance.delete(`/track-artists/${id}`);
    },
};
