import { QUERY_KEY } from '@/constants/query-key';
import { IssueLevelDataFilter } from '../types';

export const issueLevelQueryKeys = {
    all: [QUERY_KEY.ISSUE_LEVEL.KEY] as const,
    lists: () =>
        [...issueLevelQueryKeys.all, QUERY_KEY.ISSUE_LEVEL.GET_LIST] as const,
    list: (params?: IssueLevelDataFilter) =>
        params
            ? ([...issueLevelQueryKeys.lists(), params] as const)
            : issueLevelQueryKeys.lists(),
};
