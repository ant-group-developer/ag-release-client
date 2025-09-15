import axiosInstance from '@/api/axios-auth';
import { TrackScanStatusDataFilter } from '@/modules/acr-cloud/types';
import { DetailResponse, PaginationResponse } from '@/types/api';
import { TrackSensitiveData } from '../types';
import {
    CreateTrackSensitivePayload,
    UpdateTrackSensitivePayload,
} from '../types/payload';

export const trackSensitiveApis = {
    getList: (params: TrackScanStatusDataFilter) => {
        return axiosInstance.get<PaginationResponse<TrackSensitiveData>>(
            '/track-sensitive',
            {
                params,
            }
        );
    },

    getDetail: (id: TrackSensitiveData['id']) => {
        return axiosInstance.get<DetailResponse<TrackSensitiveData>>(
            `/track-sensitive/${id}`
        );
    },

    createTrackSensitive: (payload: CreateTrackSensitivePayload) => {
        return axiosInstance.post<DetailResponse<TrackSensitiveData>>(
            '/track-sensitive',
            payload
        );
    },

    updateTrackSensitive: (
        id: TrackSensitiveData['id'],
        payload: UpdateTrackSensitivePayload
    ) => {
        return axiosInstance.put<DetailResponse<TrackSensitiveData>>(
            `track-sensitive/${id}`,
            payload
        );
    },

    deleteTrackSensitive: (id: TrackSensitiveData['id']) => {
        return axiosInstance.delete(`/track-sensitive/${id}`);
    },
};
