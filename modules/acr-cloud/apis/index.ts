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
        return axiosInstance.post(`/copyright/filter`, { filter });
    },
    getScanStatus: (params: TrackScanStatusDataFilter) => {
        return axiosInstance.get<PaginationResponse<TrackScanStatusData>>(
            `/copyright/filter`,
            { params }
        );
    },
    cancelScan: (id: string) => {
        return axiosInstance.post(`/copyright/filter/${id}/cancel`);
    },
    reScan: (id: string) => {
        return axiosInstance.post(`/copyright/filter/${id}/re-scan`);
    },
};
