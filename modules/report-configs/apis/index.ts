import axiosInstance from '@/api/axios-auth';
import { DetailResponse, PaginationResponse } from '@/types/api';
import { ReportConfigData, ReportConfigDataFilter } from '../types';
import {
    CreateReportConfigPayload,
    PreValidateImportPayload,
    UpdateReportConfigPayload,
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
        return axiosInstance.post<DetailResponse<any>>(
            '/report-import/pre-validate',
            payload
        );
    },
};

