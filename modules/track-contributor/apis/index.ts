import axiosInstance from '@/api/axios-auth';
import { DetailResponse } from '@/types/api';
import { TrackContributorData } from '../types';
import {
    CreateTrackContributorPayload,
    UpdateTrackContributorPayload,
} from '../types/payload';

export const trackContributorApi = {
    create: (payload: CreateTrackContributorPayload) => {
        return axiosInstance.post<DetailResponse<TrackContributorData>>(
            '/track-contributor',
            payload
        );
    },

    update: (
        id: TrackContributorData['id'],
        payload: UpdateTrackContributorPayload
    ) => {
        return axiosInstance.put<DetailResponse<TrackContributorData>>(
            `/track-contributor/${id}`,
            payload
        );
    },

    delete: (id: TrackContributorData['id']) => {
        return axiosInstance.delete(`/track-contributor/${id}`);
    },
};
