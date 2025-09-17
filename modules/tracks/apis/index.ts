import axiosInstance from '@/api/axios-auth';
import { DetailResponse, PaginationResponse } from '@/types/api';
import { Key } from 'react';
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

    updateTrackPolicy: (
        id: TrackData['id'],
        trackPolicyId: string,
        actionId: string
    ) => {
        return axiosInstance.put<DetailResponse<TrackData[]>>(
            `/tracks/draft/${id}/track-policies/${trackPolicyId}`,
            {
                actionId,
            }
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

    getTracksWithPolicies: (params: TrackDataFilter) => {
        return axiosInstance.get<PaginationResponse<TrackData>>(
            `/tracks/draft/policy`,
            { params }
        );
    },

    deleteTrackDraft: (id: TrackData['id']) => {
        return axiosInstance.delete(`/tracks/draft/${id}`);
    },

    bulkDeleteTrackDraft: (ids: Key[]) => {
        return axiosInstance.post(`/tracks/draft/bulk-delete`, { ids });
    },
};
