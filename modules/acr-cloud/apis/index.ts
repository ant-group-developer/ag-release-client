import axiosInstance from '@/api/axios-auth';
import { DetailResponse } from '@/types/api';
import { TrackScanHistoryData } from '../types';

export const acrCloudApis = {
    getScanResult: (trackId: string) => {
        return axiosInstance.get<DetailResponse<TrackScanHistoryData[]>>(
            `/tracks/${trackId}/copyright`
        );
    },

    scanTracks: (filter: any) => {
        return axiosInstance.post(`/copyright/filter`, { filter });
    },
};
