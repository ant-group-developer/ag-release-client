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
