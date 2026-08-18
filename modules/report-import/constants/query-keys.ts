import { QUERY_KEY } from '@/constants/query-key';
import { ReportConfigDataFilter } from '../types';

export const reportConfigQueryKeys = {
    all: [QUERY_KEY.REPORT_CONFIG.KEY] as const,
    lists: () =>
        [
            ...reportConfigQueryKeys.all,
            QUERY_KEY.REPORT_CONFIG.GET_LIST,
        ] as const,
    list: (params?: ReportConfigDataFilter) =>
        params
            ? ([...reportConfigQueryKeys.lists(), params] as const)
            : reportConfigQueryKeys.lists(),
    details: () =>
        [
            ...reportConfigQueryKeys.all,
            QUERY_KEY.REPORT_CONFIG.GET_DETAIL,
        ] as const,
    detail: (id: string) => [...reportConfigQueryKeys.details(), id] as const,
    update: () =>
        [...reportConfigQueryKeys.all, QUERY_KEY.REPORT_CONFIG.UPDATE] as const,
};

export const etlJobQueryKeys = {
    all: [QUERY_KEY.ETL_JOBS.KEY] as const,
    lists: () => [...etlJobQueryKeys.all, QUERY_KEY.ETL_JOBS.GET_LIST] as const,
    list: (params?: any) =>
        params
            ? ([...etlJobQueryKeys.lists(), params] as const)
            : etlJobQueryKeys.lists(),
    statusDetails: () =>
        [...etlJobQueryKeys.all, QUERY_KEY.ETL_JOBS.GET_STATUS_DETAIL] as const,
    statusDetail: (id: string) =>
        [...etlJobQueryKeys.statusDetails(), id] as const,
};

export const enrichScanSessionQueryKeys = {
    all: [QUERY_KEY.ENRICH_SCAN_SESSIONS.KEY] as const,
    lists: () =>
        [
            ...enrichScanSessionQueryKeys.all,
            QUERY_KEY.ENRICH_SCAN_SESSIONS.GET_LIST,
        ] as const,
    list: (params?: any) =>
        params
            ? ([...enrichScanSessionQueryKeys.lists(), params] as const)
            : enrichScanSessionQueryKeys.lists(),
};

export const ftpExcludePatternQueryKeys = {
    all: [QUERY_KEY.FTP_EXCLUDE_PATTERN.KEY] as const,
    lists: () =>
        [
            ...ftpExcludePatternQueryKeys.all,
            QUERY_KEY.FTP_EXCLUDE_PATTERN.GET_LIST,
        ] as const,
    list: (params?: any) =>
        params
            ? ([...ftpExcludePatternQueryKeys.lists(), params] as const)
            : ftpExcludePatternQueryKeys.lists(),
    details: () =>
        [
            ...ftpExcludePatternQueryKeys.all,
            QUERY_KEY.FTP_EXCLUDE_PATTERN.GET_DETAIL,
        ] as const,
    detail: (id: string) =>
        [...ftpExcludePatternQueryKeys.details(), id] as const,
};

export const enrichScanScheduleQueryKeys = {
    all: [QUERY_KEY.ENRICH_SCAN_SCHEDULES.KEY] as const,
    lists: () =>
        [
            ...enrichScanScheduleQueryKeys.all,
            QUERY_KEY.ENRICH_SCAN_SCHEDULES.GET_LIST,
        ] as const,
    list: (params?: any) =>
        params
            ? ([...enrichScanScheduleQueryKeys.lists(), params] as const)
            : enrichScanScheduleQueryKeys.lists(),
};

export const enrichHistoryQueryKeys = {
    all: [QUERY_KEY.ENRICH_HISTORY.KEY] as const,
    lists: () =>
        [
            ...enrichHistoryQueryKeys.all,
            QUERY_KEY.ENRICH_HISTORY.GET_LIST,
        ] as const,
    list: (params?: any) =>
        params
            ? ([...enrichHistoryQueryKeys.lists(), params] as const)
            : enrichHistoryQueryKeys.lists(),
};

export const sourceTypeConfigQueryKeys = {
    all: [QUERY_KEY.SOURCE_TYPE_CONFIG.KEY] as const,
    lists: () =>
        [
            ...sourceTypeConfigQueryKeys.all,
            QUERY_KEY.SOURCE_TYPE_CONFIG.GET_LIST,
        ] as const,
};

export const ftpProviderConfigQueryKeys = {
    all: [QUERY_KEY.FTP_PROVIDER_CONFIG.KEY] as const,
    lists: () =>
        [
            ...ftpProviderConfigQueryKeys.all,
            QUERY_KEY.FTP_PROVIDER_CONFIG.GET_LIST,
        ] as const,
    list: (params?: any) =>
        params
            ? ([...ftpProviderConfigQueryKeys.lists(), params] as const)
            : ftpProviderConfigQueryKeys.lists(),
    details: () =>
        [
            ...ftpProviderConfigQueryKeys.all,
            QUERY_KEY.FTP_PROVIDER_CONFIG.GET_DETAIL,
        ] as const,
    detail: (id: string) =>
        [...ftpProviderConfigQueryKeys.details(), id] as const,
};


