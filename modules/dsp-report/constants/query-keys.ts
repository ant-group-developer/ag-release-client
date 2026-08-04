import { QUERY_KEY } from '@/constants/query-key';

export const dspReportQueryKeys = {
    all: [QUERY_KEY.DSP_REPORT.KEY] as const,

    lists: () =>
        [...dspReportQueryKeys.all, QUERY_KEY.DSP_REPORT.GET_LIST] as const,
    list: (params?: Record<string, any>) =>
        params
            ? ([...dspReportQueryKeys.lists(), params] as const)
            : dspReportQueryKeys.lists(),

    details: () =>
        [...dspReportQueryKeys.all, QUERY_KEY.DSP_REPORT.GET_DETAIL] as const,
    detail: (id: string) => [...dspReportQueryKeys.details(), id] as const,

    ftpParserConfigsDetails: () =>
        [...dspReportQueryKeys.all, QUERY_KEY.DSP_REPORT.GET_FTP_PARSER_CONFIGS] as const,
    ftpParserConfigs: (id: string) =>
        [...dspReportQueryKeys.ftpParserConfigsDetails(), id] as const,

    ftpReportFileRulesDetails: () =>
        [
            ...dspReportQueryKeys.all,
            QUERY_KEY.DSP_REPORT.GET_FTP_REPORT_FILE_RULES,
        ] as const,
    ftpReportFileRules: (params?: Record<string, any>) =>
        [
            ...dspReportQueryKeys.ftpReportFileRulesDetails(),
            params,
        ] as const,

    parserCatalogDetails: () =>
        [
            ...dspReportQueryKeys.all,
            QUERY_KEY.DSP_REPORT.GET_PARSER_CATALOG_DETAIL,
        ] as const,
    parserCatalogDetail: (parserCode: string) =>
        [...dspReportQueryKeys.parserCatalogDetails(), parserCode] as const,

    ftpReportFileDiscoveryRuns: () =>
        [
            ...dspReportQueryKeys.all,
            QUERY_KEY.DSP_REPORT.GET_FTP_REPORT_FILE_DISCOVERY_RUNS,
        ] as const,
};

export const pgDspsSyncQueryKeys = {
    all: [QUERY_KEY.PG_DSPS_SYNC.KEY] as const,

    lists: () =>
        [...pgDspsSyncQueryKeys.all, QUERY_KEY.PG_DSPS_SYNC.GET_LIST] as const,
    list: (params?: Record<string, any>) =>
        params
            ? ([...pgDspsSyncQueryKeys.lists(), params] as const)
            : pgDspsSyncQueryKeys.lists(),
};
