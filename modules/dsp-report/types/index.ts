import { CommonParams } from '@/types/api';
import {
    FTP_REPORT_FILE_RULE_SOURCE_CATEGORY,
    FTP_REPORT_FILE_RULE_STATUS,
} from '../enums';

export interface PgDspsSyncData {
    pgUuid: string;
    dspCode: string;
    dspName: string;
    dspCiCode: string;
    picture?: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface PgDspsSyncDataFilter extends CommonParams {}

export interface DspReportData {
    idDspsReport: string;
    pgUuid: string;
    dspName: string;
    source: string;
    createdAt: string;
    updatedAt: string;
    pgDspsSync?: PgDspsSyncData | null;
    pendingReleasesCount?: number;
}

export interface DspReportDataFilter extends CommonParams {
    source?: string;
    pgUuid?: string;
    status?: string;
}

export interface FieldMapping {
    reportColumn: string;
    parserColumn: string;
    targetColumn: string;
    transform: string;
}

export interface FtpParser {
    parserCode: string;
    sourceCategory: string;
    parserName: string;
    sourceFile: string;
    targetTable: string;
    fieldMappings: FieldMapping[];
    sourceHash: string;
    isSelectable: boolean;
    syncedAt: string;
}

export interface FtpParserConfig {
    dspReportId: string;
    sourceCategory: string;
    parserCode: string;
    includePatterns: string[];
    excludePatterns: string[];
    isActive: boolean;
    description: string;
    configVersion: number;
    createdAt: string;
    updatedAt: string;
    parser: FtpParser;
}

export interface FtpReportSampleFile {
    ftpPath: string;
    key: string;
    fileName: string;
    url: string;
}

export interface FtpReportFileRule {
    id: string;
    source: string;
    sourceCategory: FTP_REPORT_FILE_RULE_SOURCE_CATEGORY | string;
    dspFolderPattern: string;
    fileNamePattern: string;
    status: FTP_REPORT_FILE_RULE_STATUS | string;
    parserCode: string;
    description: string | null;
    configVersion: number;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    sampleFiles: FtpReportSampleFile[];
}

export interface FtpReportFileRuleFilter extends CommonParams {
    sourceCategory?: FTP_REPORT_FILE_RULE_SOURCE_CATEGORY | string;
    status?: FTP_REPORT_FILE_RULE_STATUS | string;
    isActive?: boolean;
    source?: string;
    dspFolder?: string;
}

export interface FtpReportFileDiscoveryRun {
    id: string;
    source: string;
    force: number;
    status: string;
    periods_scanned: number;
    folders_scanned: number;
    files_scanned: number;
    patterns_upserted: number;
    error_message: string;
    started_at: string;
    completed_at: string;
    updated_at: string;
}
