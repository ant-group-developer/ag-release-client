import axiosInstance from '@/api/axios-auth';
import { DetailResponse, PaginationResponse } from '@/types/api';
import {
    TrackScanHistoryData,
    TrackScanStatusData,
    TrackScanStatusDataFilter,
} from '../types';
import { ScanTracksPayload } from '../types/payloads';

export const acrCloudApis = {
    getScanResult: (trackId: string) => {
        return axiosInstance.get<DetailResponse<TrackScanHistoryData[]>>(
            `/tracks/${trackId}/copyright`
        );
    },
    scanTracks: (filter: ScanTracksPayload['filter']) => {
        return axiosInstance.post(`/copyright/tasks`, { filter });
    },
    getScanStatus: (params: TrackScanStatusDataFilter) => {
        return axiosInstance.get<PaginationResponse<TrackScanStatusData>>(
            `/copyright/tasks`,
            { params }
        );
    },
    cancelScan: (id: string) => {
        return axiosInstance.post(`/copyright/tasks/${id}/cancel`);
    },
    reScan: (id: string) => {
        return axiosInstance.post(`/copyright/tasks/${id}/re-scan`);
    },
    getDetailScanStatus: (id: string) => {
        return axiosInstance.get<DetailResponse<TrackScanStatusData>>(
            `/copyright/tasks/${id}`
        );
    },
};
