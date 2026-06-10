import { ReportConfigData } from '.';

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

