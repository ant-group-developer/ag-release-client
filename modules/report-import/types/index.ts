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

