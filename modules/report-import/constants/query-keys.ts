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
        [
            ...reportConfigQueryKeys.all,
            QUERY_KEY.REPORT_CONFIG.UPDATE,
        ] as const,
};

export const etlJobQueryKeys = {
    all: [QUERY_KEY.ETL_JOBS.KEY] as const,
    lists: () => [...etlJobQueryKeys.all, QUERY_KEY.ETL_JOBS.GET_LIST] as const,
    list: (params?: any) =>
        params
            ? ([...etlJobQueryKeys.lists(), params] as const)
            : etlJobQueryKeys.lists(),
};

export const ftpExcludePatternQueryKeys = {
    all: [QUERY_KEY.FTP_EXCLUDE_PATTERN.KEY] as const,
    lists: () => [...ftpExcludePatternQueryKeys.all, QUERY_KEY.FTP_EXCLUDE_PATTERN.GET_LIST] as const,
    list: (params?: any) =>
        params
            ? ([...ftpExcludePatternQueryKeys.lists(), params] as const)
            : ftpExcludePatternQueryKeys.lists(),
    details: () => [...ftpExcludePatternQueryKeys.all, QUERY_KEY.FTP_EXCLUDE_PATTERN.GET_DETAIL] as const,
    detail: (id: string) => [...ftpExcludePatternQueryKeys.details(), id] as const,
};
