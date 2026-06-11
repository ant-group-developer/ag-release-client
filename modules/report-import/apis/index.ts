import axiosInstance from '@/api/axios-auth';
import { DetailResponse, PaginationResponse, SuccessResponse, CommonParams } from '@/types/api';
import { ReportConfigData, ReportConfigDataFilter } from '../types';
import {
    CreateReportConfigPayload,
    ImportJobStatusResponse,
    PreValidateImportPayload,
    PreValidateImportResponse,
    UpdateReportConfigPayload,
    EtlJobData,
} from '../types/payload';

export const reportConfigApis = {
    getList: (params: ReportConfigDataFilter) => {
        return axiosInstance.get<PaginationResponse<ReportConfigData>>(
            '/report-source-configs',
            { params }
        );
    },
    getDetail: (id: ReportConfigData['id']) => {
        return axiosInstance.get<DetailResponse<ReportConfigData>>(
            `/report-source-configs/${id}`
        );
    },
    create: (payload: CreateReportConfigPayload) => {
        return axiosInstance.post<DetailResponse<ReportConfigData>>(
            '/report-source-configs',
            payload
        );
    },
    update: (
        id: ReportConfigData['id'],
        payload: UpdateReportConfigPayload
    ) => {
        return axiosInstance.put<DetailResponse<ReportConfigData>>(
            `/report-source-configs/${id}`,
            payload
        );
    },
    delete: (id: ReportConfigData['id']) => {
        return axiosInstance.delete(`/report-source-configs/${id}`);
    },
    preValidateImport: (payload: PreValidateImportPayload) => {
        return axiosInstance.post<DetailResponse<PreValidateImportResponse>>(
            '/report-import/pre-validate',
            payload
        );
    },
    startImportJob: (jobId: string) => {
        return axiosInstance.post<SuccessResponse>(
            `/report-import/jobs/${jobId}/start`
        );
    },
    getImportJobStatus: (jobId: string) => {
        return axiosInstance.get<DetailResponse<ImportJobStatusResponse>>(
            `/report-import/jobs/${jobId}/status`
        );
    },
    getListEtlJobs: (params: CommonParams) => {
        return axiosInstance.get<PaginationResponse<EtlJobData>>(
            '/etl/jobs',
            { params }
        );
    },
};

