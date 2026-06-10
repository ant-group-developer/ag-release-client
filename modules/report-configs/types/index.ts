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
