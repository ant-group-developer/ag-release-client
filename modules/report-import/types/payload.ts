import { ReportConfigData, FtpExcludePatternData } from '.';

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

export enum ImportJobStatus {
    PENDING = 'PENDING',
    PROCESSING = 'PROCESSING',
    COMPLETED = 'COMPLETED',
    FAILED = 'FAILED',
}

export enum FileUploadStatus {
    IDLE = 'idle',
    UPLOADING = 'uploading',
    SUCCESS = 'success',
    FAILED = 'failed',
}

export interface ImportJobStatusResponse {
    id: string;
    status: ImportJobStatus;
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
    file: string;
    error: string | null;
    result: any;
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
    sourceType: string;
    status: ImportJobStatus;
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
    };
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
    result: any;
    error: string | null;
    batchId: string | null;
    tenantId: string;
    createdBy: string;
    createdAt: string;
    startedAt: string | null;
    finishedAt: string | null;
    durationMs: number;
}

export interface CreateFtpExcludePatternPayload {
    pattern: string;
    patternType: string;
    scope: string;
    isActive: boolean;
    description: string;
}

export interface UpdateFtpExcludePatternPayload
    extends Partial<CreateFtpExcludePatternPayload> {}
