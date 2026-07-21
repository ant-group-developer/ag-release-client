import axiosInstance from '@/api/axios-auth';
import {
    CommonParams,
    DetailResponse,
    PaginationResponse,
    SuccessResponse,
} from '@/types/api';
import {
    EnrichScanScheduleData,
    FtpExcludePatternData,
    FtpExcludePatternDataFilter,
    ReportConfigData,
    ReportConfigDataFilter,
    SyncConfigData,
    SpotifyR2SyncConfig,
    SpotifyExportSchedulerConfig,
} from '../types';
import {
    CreateEnrichScanSchedulePayload,
    CreateFtpExcludePatternPayload,
    CreateReportConfigPayload,
    DeleteImportedReleasesPayload,
    DeleteImportedReleasesResponse,
    EnrichHistoryResponse,
    EnrichScanSessionData,
    EtlJobData,
    EtlJobStatusDetailData,
    GetEnrichHistoryParams,
    ImportJobStatusResponse,
    PreValidateImportPayload,
    PreValidateImportResponse,
    StartEnrichScanPayload,
    StartEnrichScanResponse,
    UpdateEnrichScanSchedulePayload,
    UpdateFtpExcludePatternPayload,
    UpdateReportConfigPayload,
} from '../types/payload';

const REPORT_IMPORT_API_PATHS = {
    ENRICH_SCAN: '/partners/enrich/scan',
    ENRICH_SCAN_SESSIONS: '/partners/enrich/scan/sessions',
    ENRICH_HISTORY: '/partners/enrich/history',
    RELEASES_DELETE: '/report-import/releases/delete',
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
    deleteImportedReleases: (payload: DeleteImportedReleasesPayload) => {
        return axiosInstance.post<DeleteImportedReleasesResponse>(
            REPORT_IMPORT_API_PATHS.RELEASES_DELETE,
            payload
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
    getEtlJobStatusDetail: (id: string) => {
        return axiosInstance.get<DetailResponse<EtlJobStatusDetailData>>(
            `/etl/jobs/${id}/status-detail`
        );
    },
    getListEnrichScanSessions: (params: CommonParams) => {
        return axiosInstance.get<PaginationResponse<EnrichScanSessionData>>(
            REPORT_IMPORT_API_PATHS.ENRICH_SCAN_SESSIONS,
            { params }
        );
    },
    getEnrichHistory: (params: GetEnrichHistoryParams) => {
        return axiosInstance.get<DetailResponse<EnrichHistoryResponse>>(
            REPORT_IMPORT_API_PATHS.ENRICH_HISTORY,
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
    cancelEnrichScan: (scanId: string) => {
        return axiosInstance.post<SuccessResponse>(
            `${REPORT_IMPORT_API_PATHS.ENRICH_SCAN}/${scanId}/cancel`
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

export const enrichScanScheduleApis = {
    getList: (params: CommonParams) => {
        return axiosInstance.get<PaginationResponse<EnrichScanScheduleData>>(
            '/partners/enrich/scan/schedules',
            { params }
        );
    },
    create: (payload: CreateEnrichScanSchedulePayload) => {
        return axiosInstance.post<DetailResponse<EnrichScanScheduleData>>(
            '/partners/enrich/scan/schedules',
            payload
        );
    },
    update: (id: string, payload: UpdateEnrichScanSchedulePayload) => {
        return axiosInstance.put<DetailResponse<EnrichScanScheduleData>>(
            `/partners/enrich/scan/schedules/${id}`,
            payload
        );
    },
    delete: (id: string) => {
        return axiosInstance.delete(`/partners/enrich/scan/schedules/${id}`);
    },
};

export const spotifyR2SyncConfigApis = {
    get: () => {
        return axiosInstance.get<DetailResponse<SpotifyR2SyncConfig>>(
            '/report-import/spotify/r2-sync-config'
        );
    },
    update: (payload: SpotifyR2SyncConfig) => {
        return axiosInstance.put<DetailResponse<SpotifyR2SyncConfig>>(
            '/report-import/spotify/r2-sync-config',
            payload
        );
    },
    syncR2: () => {
        return axiosInstance.post<
            DetailResponse<{ jobId: string; status: string; message: string }>
        >('/report-import/spotify/sync-r2');
    },
    exportTrigger: (payload: { force: boolean }) => {
        return axiosInstance.post<
            DetailResponse<{ jobId: string; status: string; message: string }>
        >('/report-import/spotify/export-trigger', payload);
    },
};

export const spotifyExportSchedulerConfigApis = {
    get: () => {
        return axiosInstance.get<DetailResponse<SpotifyExportSchedulerConfig>>(
            '/report-import/spotify/export-scheduler-config'
        );
    },
    update: (payload: SpotifyExportSchedulerConfig) => {
        return axiosInstance.put<DetailResponse<SpotifyExportSchedulerConfig>>(
            '/report-import/spotify/export-scheduler-config',
            payload
        );
    },
};

