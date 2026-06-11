import axiosInstance from '@/api/axios-auth';
import { PaginationResponse } from '@/types/api';
import {
    DspReportData,
    DspReportDataFilter,
    PgDspsSyncData,
    PgDspsSyncDataFilter,
} from '../types';

export const dspReportApi = {
    getList: (params: DspReportDataFilter) => {
        return axiosInstance.get<PaginationResponse<DspReportData>>(
            '/dsp-report',
            {
                params,
            }
        );
    },
    assign: (id: number | string, data: { pgUuid: string }) => {
        return axiosInstance.put(`/dsp-report/${id}/assign`, data);
    },
    unassign: (id: number | string) => {
        return axiosInstance.put(`/dsp-report/${id}/unassign`);
    },
};

export const pgDspsSyncApi = {
    getList: (params: PgDspsSyncDataFilter) => {
        return axiosInstance.get<PaginationResponse<PgDspsSyncData>>(
            '/pg-dsps-sync',
            {
                params,
            }
        );
    },
};
