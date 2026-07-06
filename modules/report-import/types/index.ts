import { CommonAttribute, CommonParams } from '@/types/api';

export interface ReportConfigData extends CommonAttribute {
    sourceCode: string;
    sourceName: string;
    reportType: string;
    folderPatterns: string[];
    filePatterns: string[];
    requiredHeaders: string[];
    parserCode: string;
    delimiter: string;
    defaultCurrency: string;
    defaultMember: string;
    priority: number;
}

export interface ReportConfigDataFilter extends CommonParams {}

export interface FtpExcludePatternData extends CommonAttribute {
    pattern: string;
    patternType: string;
    scope: string;
    isActive: number;
    description: string;
    isDeleted: number;
}

export interface FtpExcludePatternDataFilter extends CommonParams {
    scope?: string;
    patternType?: string;
    isActive?: boolean | string;
}

export interface SyncConfigData {
    mode: string;
    cron: string;
    startPeriod: string;
    categories: string[];
    force: boolean;
    excludeEnabled: boolean;
    maxRetries: number;
}

export interface EnrichScanScheduleData extends CommonAttribute {
    name: string;
    enabled: boolean;
    cronExpression: string;
    timezone: string;
    isImportedFromReport: boolean;
    limitCount: number;
    force: boolean;
    isDeleted: boolean;
    lastRunAt: string | null;
    lastScanId: string | null;
    lastSkippedAt: string | null;
    lastSkipReason: string | null;
    lastError: string | null;
}

export interface EnrichScanScheduleDataFilter extends CommonParams {}

export interface SpotifyR2SyncConfig {
    enabled: boolean;
    cron: string;
    prefix: string;
    retentionDays: number;
}

export interface SpotifyExportSchedulerConfig {
    enabled: boolean;
    cron: string;
    force: boolean;
}


