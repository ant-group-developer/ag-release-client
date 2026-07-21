import { CommonParams } from '@/types/api';

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
