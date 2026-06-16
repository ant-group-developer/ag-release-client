import axiosInstance from '@/api/axios-auth';
import {
    CommonParams,
    DetailResponse,
    PaginationResponse,
    SuccessResponse,
} from '@/types/api';
import {
    FtpExcludePatternData,
    FtpExcludePatternDataFilter,
    ReportConfigData,
    ReportConfigDataFilter,
    SyncConfigData,
} from '../types';
import {
    CreateFtpExcludePatternPayload,
    CreateReportConfigPayload,
    EnrichScanSessionData,
    EtlJobData,
    ImportJobStatusResponse,
    PreValidateImportPayload,
    PreValidateImportResponse,
    StartEnrichScanPayload,
    StartEnrichScanResponse,
    UpdateFtpExcludePatternPayload,
    UpdateReportConfigPayload,
} from '../types/payload';

const REPORT_IMPORT_API_PATHS = {
    ENRICH_SCAN: '/partners/enrich/scan',
    ENRICH_SCAN_SESSIONS: '/partners/enrich/scan/sessions',
} as const;

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
        return axiosInstance.get<PaginationResponse<EtlJobData>>('/etl/jobs', {
            params,
        });
    },
    getListEnrichScanSessions: (params: CommonParams) => {
        return axiosInstance.get<PaginationResponse<EnrichScanSessionData>>(
            REPORT_IMPORT_API_PATHS.ENRICH_SCAN_SESSIONS,
            { params }
        );
    },
    startEnrichScan: (params: StartEnrichScanPayload) => {
        return axiosInstance.post<DetailResponse<StartEnrichScanResponse>>(
            REPORT_IMPORT_API_PATHS.ENRICH_SCAN,
            undefined,
            { params }
        );
    },
};

export const ftpExcludePatternApis = {
    getList: (params: FtpExcludePatternDataFilter) => {
        return axiosInstance.get<PaginationResponse<FtpExcludePatternData>>(
            '/ftp-exclude-patterns',
            { params }
        );
    },
    getDetail: (id: FtpExcludePatternData['id']) => {
        return axiosInstance.get<DetailResponse<FtpExcludePatternData>>(
            `/ftp-exclude-patterns/${id}`
        );
    },
    create: (payload: CreateFtpExcludePatternPayload) => {
        return axiosInstance.post<DetailResponse<FtpExcludePatternData>>(
            '/ftp-exclude-patterns',
            payload
        );
    },
    update: (
        id: FtpExcludePatternData['id'],
        payload: UpdateFtpExcludePatternPayload
    ) => {
        return axiosInstance.put<DetailResponse<FtpExcludePatternData>>(
            `/ftp-exclude-patterns/${id}`,
            payload
        );
    },
    delete: (id: FtpExcludePatternData['id']) => {
        return axiosInstance.delete(`/ftp-exclude-patterns/${id}`);
    },
};

export const etlSyncConfigApis = {
    get: () => {
        return axiosInstance.get<DetailResponse<SyncConfigData>>(
            '/etl/sync-config'
        );
    },
    update: (payload: Partial<SyncConfigData>) => {
        return axiosInstance.put<DetailResponse<SyncConfigData>>(
            '/etl/sync-config',
            payload
        );
    },
    sync: (payload: {
        month_start: string;
        month_end: string;
        force: boolean;
        categories?: string[];
    }) => {
        return axiosInstance.post<SuccessResponse>('/etl/ftp/sync', payload);
    },
    syncAll: (payload: {
        startPeriod: string;
        force: boolean;
        categories?: string[];
    }) => {
        return axiosInstance.post<SuccessResponse>(
            '/etl/ftp/sync-all',
            payload
        );
    },
};
