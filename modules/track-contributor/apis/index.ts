import axiosInstance from '@/api/axios-auth';
import { DetailResponse } from '@/types/api';
import { TrackContributorData } from '../types';
import {
    BulkCreateTrackContributorPayload,
    CreateTrackContributorPayload,
    UpdateTrackContributorPayload,
} from '../types/payload';

export const trackContributorApi = {
    create: (payload: CreateTrackContributorPayload) => {
        return axiosInstance.post<DetailResponse<TrackContributorData>>(
            '/track-contributors',
            payload
        );
    },

    bulkCreate: (payload: BulkCreateTrackContributorPayload) => {
        return axiosInstance.post('/track-contributors/bulk', payload);
    },

    update: (
        id: TrackContributorData['id'],
        payload: UpdateTrackContributorPayload
    ) => {
        return axiosInstance.put<DetailResponse<TrackContributorData>>(
            `/track-contributors/${id}`,
            payload
        );
    },

    delete: (id: TrackContributorData['id']) => {
        return axiosInstance.delete(`/track-contributors/${id}`);
    },
};
