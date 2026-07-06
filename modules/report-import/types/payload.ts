import { ReportConfigData } from '.';
import {
    ENRICH_CHANGE_TYPE,
    ENRICH_ENTITY_TYPE,
    ENRICH_HISTORY_STATUS,
    ENRICH_SCAN_STATUS,
    ENRICHMENT_SOURCE,
    ETL_JOB_SOURCE_TYPE,
} from '../enums';

export interface CreateReportConfigPayload
    extends Pick<
        ReportConfigData,
        | 'sourceCode'
        | 'sourceName'
        | 'reportType'
        | 'folderPatterns'
        | 'filePatterns'
        | 'requiredHeaders'
        | 'parserCode'
        | 'delimiter'
        | 'defaultCurrency'
        | 'defaultMember'
        | 'priority'
    > {}

export interface UpdateReportConfigPayload
    extends Partial<CreateReportConfigPayload> {}

export interface PreValidateImportFile {
    path: string;
    size: number;
}

export interface PreValidateImportPayload {
    files: PreValidateImportFile[];
    tenantId: string;
    allowedExtensions: string[];
}

export interface PreValidateImportMatchedFile {
    path: string;
    r2Key: string;
    uploadUrl: string;
}

export interface PreValidateImportInvalidFile {
    path: string;
    reason: string;
}

export interface PreValidateImportResponse {
    jobId: string;
    matched: PreValidateImportMatchedFile[];
    invalid: PreValidateImportInvalidFile[];
}

export enum IMPORT_JOBS_STATUS {
    PENDING = 'PENDING',
    QUEUED = 'QUEUED',
    PROCESSING = 'PROCESSING',
    COMPLETED = 'COMPLETED',
    FAILED = 'FAILED',
    CANCELLED = 'CANCELLED',
}

export const RUNNING_IMPORT_JOB_STATUSES = [
    IMPORT_JOBS_STATUS.PENDING,
    IMPORT_JOBS_STATUS.QUEUED,
    IMPORT_JOBS_STATUS.PROCESSING,
];

export enum FileUploadStatus {
    IDLE = 'idle',
    UPLOADING = 'uploading',
    SUCCESS = 'success',
    FAILED = 'failed',
}

export interface ImportJobResultReleases {
    total: number;
    imported: number;
    skipped: number;
    errors: number;
    inDb: number;
    pending: number;
}

export interface ImportJobResult {
    affectedPeriods?: string[] | null;
    totalProcessedRows?: number | null;
    releases?: ImportJobResultReleases | null;
}

export interface ImportJobStatusResponse {
    id: string;
    status: IMPORT_JOBS_STATUS;
    progress: {
        current: number;
        total: number;
        label: string;
        detail?: {
            currentFile: string;
            status: string;
            files: {
                name: string;
                status: 'done' | 'processing' | 'pending' | 'failed' | string;
            }[];
        };
    };
    rows: {
        total: number;
        processed: number;
        skipped: number;
        errors: number;
    };
    file: string;
    error: string | null;
    result: ImportJobResult | null;
    sourceType?: string;
    detailR2Sync?: {
        zipsFound: number;
        zipsImported: number;
        zipsSkipped: number;
    } | null;
    detailExport?: {
        jobSpoId: string;
        foldersUploaded: number;
        r2ObjectKeys: string[];
    } | null;
    startedAt: string | null;
    finishedAt: string | null;
    durationMs: number;
    params?: {
        files?: {
            path: string;
            r2Key: string;
            uploadUrl?: string;
            size: number;
            sourceCode?: string;
            reportType?: string;
            parserCode?: string;
        }[];
    };
}

export interface EtlJobData {
    id: string;
    sourceType: ETL_JOB_SOURCE_TYPE | string;
    status: IMPORT_JOBS_STATUS;
    progress: {
        current: number;
        total: number;
        label: string;
    };
    rows: {
        total: number;
        processed: number;
        skipped: number;
        errors: number;
    };
    file: {
        name: string;
        sizeBytes: number;
        hash: string | null;
    } | null;
    params?: {
        tenantId?: string;
        deleteAll?: boolean;
        resolvedFromDateUtc?: string | null;
        resolvedToDateUtc?: string | null;
        matchedReleases?: number;
        matchedTracks?: number;
        files?: {
            path: string;
            r2Key: string;
            uploadUrl?: string;
            size: number;
            sourceCode?: string;
            reportType?: string;
            parserCode?: string;
        }[];
    };
    result: ImportJobResult | null;
    detailR2Sync?: {
        zipsFound: number;
        zipsImported: number;
        zipsSkipped: number;
    } | null;
    detailExport?: {
        jobSpoId: string;
        foldersUploaded: number;
        r2ObjectKeys: string[];
    } | null;
    error: string | null;
    batchId: string | null;
    tenantId: string;
    createdBy: string;
    createdAt: string;
    startedAt: string | null;
    finishedAt: string | null;
    durationMs: number;
}

export interface EnrichScanSessionData {
    id: string;
    createdAt: string;
    updatedAt: string;
    status: ENRICH_SCAN_STATUS | string;
    totalReleases: number;
    processedReleases: number;
    successCount: number;
    failedCount: number;
    notFoundCount: number;
    dryRun: boolean;
    force: boolean;
    limitCount: number;
    errorMessage: string | null;
    startedAt: string | null;
    finishedAt: string | null;
}

export interface StartEnrichScanPayload {
    dryRun?: boolean;
    limit: number;
    force: boolean;
    isImportedFromReport?: boolean;
}

export interface DeleteImportedReleasesPayload {
    fromDate?: string;
    toDate?: string;
    tenantId?: string;
    labelId?: string;
    importSourceType?: ETL_JOB_SOURCE_TYPE | string;
    parserCode?: string;
    fileName?: string;
    deleteAll?: boolean;
}

export interface DeleteImportedReleasesResponse {
    id?: string;
    jobId?: string;
    status?: IMPORT_JOBS_STATUS | string;
    eventsUrl?: string;
    data?: DeleteImportedReleasesResponse;
    [key: string]: any;
}

export enum DeleteImportedReleasesEventType {
    PROGRESS = 'progress',
    HEARTBEAT = 'heartbeat',
    COMPLETED = 'completed',
    FAILED = 'failed',
}

export interface DeleteImportedReleasesEventData
    extends Partial<Omit<EtlJobData, 'id'>> {
    type: DeleteImportedReleasesEventType | string;
    id?: string;
    summary?: Partial<EtlJobData>;
    message?: string;
    [key: string]: any;
}

export interface EnrichScanSummary {
    status?: ENRICH_SCAN_STATUS | string;
    totalReleases: number;
    processedReleases: number;
    successCount: number;
    failedCount: number;
    notFoundCount: number;
    errorMessage: string | null;
}

export interface StartEnrichScanSummary {
    totalReleases: number;
    totalDone: number;
    totalRemaining: number;
    successCount: number;
    failedCount: number;
    notFoundCount: number;
    pendingCount: number;
}

export interface StartEnrichScanResponse extends StartEnrichScanPayload {
    message: string;
    scanId: string;
    summary: StartEnrichScanSummary;
}

export enum EnrichScanEventType {
    SNAPSHOT = 'snapshot',
    PROGRESS = 'progress',
    HEARTBEAT = 'heartbeat',
    COMPLETED = 'completed',
    FAILED = 'failed',
    CANCELLED = 'cancelled',
}

export interface EnrichScanEventData {
    type: EnrichScanEventType | string;
    scanId?: string;
    message?: string;
    summary?: Partial<EnrichScanSummary>;
    progress?: Partial<EnrichScanSummary>;
    status?: ENRICH_SCAN_STATUS | string;
    totalReleases?: number;
    processedReleases?: number;
    successCount?: number;
    failedCount?: number;
    notFoundCount?: number;
    errorMessage?: string | null;
    [key: string]: any;
}

export interface CreateFtpExcludePatternPayload {
    pattern: string;
    patternType: string;
    scope: string[];
    isActive: boolean;
    description: string;
}

export interface UpdateFtpExcludePatternPayload
    extends Partial<CreateFtpExcludePatternPayload> {}

export interface CreateEnrichScanSchedulePayload {
    name: string;
    enabled: boolean;
    cronExpression: string;
    timezone?: string;
    isImportedFromReport?: boolean;
    limitCount: number;
    force: boolean;
}

export interface UpdateEnrichScanSchedulePayload
    extends Partial<CreateEnrichScanSchedulePayload> {}

export interface EnrichHistorySummary {
    totalReleases: number;
    totalDone: number;
    totalRemaining: number;
    successCount: number;
    failedCount: number;
    notFoundCount: number;
    pendingCount: number;
    processingCount: number;
    totalReleasesCount: number;
    totalReleasesDone: number;
    totalReleasesRemaining: number;
    successReleasesCount: number;
    failedReleasesCount: number;
    notFoundReleasesCount: number;
    pendingReleasesCount: number;
    processingReleasesCount: number;
}

export interface EnrichHistoryItem {
    id: string;
    scanId: string;
    entityType: ENRICH_ENTITY_TYPE | string;
    entityId: string;
    releaseId: string;
    isrc: string;
    upc: string;
    fieldName: string;
    oldValue: string;
    newValue: string;
    changeType: ENRICH_CHANGE_TYPE | string;
    enrichmentSource: ENRICHMENT_SOURCE | string;
    apiTrackId: string;
    apiAlbumId: string;
    apiArtistId: string;
    status: ENRICH_HISTORY_STATUS | string;
    errorMessage: string;
    isDryRun: boolean;
    createdAt: string;
    createdBy: string;
}

export interface EnrichHistorySession {
    startedAt: string | null;
    finishedAt: string | null;
    durationMs: number | null;
    duration: string | null;
    status: ENRICH_SCAN_STATUS | string;
}

export interface EnrichHistoryResponse {
    items: EnrichHistoryItem[];
    summary: EnrichHistorySummary;
    session?: EnrichHistorySession | null;
    metadata: {
        page: number;
        limit: number;
        totalItems: number;
        totalPages: number;
    };
}

export interface GetEnrichHistoryParams {
    page?: number;
    pageSize?: number;
    scanId?: string | null;
}
