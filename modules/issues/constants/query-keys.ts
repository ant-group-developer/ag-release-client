import { QUERY_KEY } from '@/constants/query-key';
import { IssueDataFilter } from '../types';

export const issuesQueryKeys = {
    all: [QUERY_KEY.ISSUES.KEY] as const,
    lists: () => [...issuesQueryKeys.all, QUERY_KEY.ISSUES.GET_LIST] as const,
    list: (params?: IssueDataFilter) =>
        params
            ? ([...issuesQueryKeys.lists(), params] as const)
            : issuesQueryKeys.lists(),
};
