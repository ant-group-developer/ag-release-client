import axiosInstance from '@/api/axios-auth';
import { PaginationResponse, ListResponse, DetailResponse } from '@/types/api';
import {
    DspReportData,
    DspReportDataFilter,
    PgDspsSyncData,
    PgDspsSyncDataFilter,
    FtpParserConfig,
    FieldMapping,
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
    assign: (id: string, data: { pgUuid: string }) => {
        return axiosInstance.put(`/dsp-report/${id}/assign`, data);
    },
    unassign: (id: string) => {
        return axiosInstance.put(`/dsp-report/${id}/unassign`);
    },
    delete: (id: string) => {
        return axiosInstance.delete(`/dsp-report/${id}`);
    },
    getFtpParserConfigs: (id: string) => {
        return axiosInstance.get<ListResponse<FtpParserConfig>>(
            `/dsp-report/${id}/ftp-parser-configs`
        );
    },
    getFtpParserConfigDetail: (id: string, category: string) => {
        return axiosInstance.get<DetailResponse<FtpParserConfig>>(
            `/dsp-report/${id}/ftp-parser-configs/${category}`
        );
    },
    updateFtpParserConfig: (
        id: string,
        category: string,
        data: Partial<FtpParserConfig>
    ) => {
        return axiosInstance.put(
            `/dsp-report/${id}/ftp-parser-configs/${category}`,
            data
        );
    },
    updateFieldMappings: (
        parserCode: string,
        data: { fieldMappings: FieldMapping[] }
    ) => {
        return axiosInstance.patch(
            `/dsp-report/parser-catalog/${parserCode}/field-mappings`,
            data
        );
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
