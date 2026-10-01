import { QUERY_KEY } from '@/constants/query-key';
import { ReleaseMergeItemFilter, ReleaseMergeRunFilter } from '../types';

export const releaseMergeQueryKeys = {
    all: [QUERY_KEY.RELEASE_MERGE.KEY] as const,
    lists: () =>
        [...releaseMergeQueryKeys.all, QUERY_KEY.RELEASE_MERGE.GET_LIST] as const,
    list: (params?: ReleaseMergeRunFilter) =>
        params
            ? ([...releaseMergeQueryKeys.lists(), params] as const)
            : releaseMergeQueryKeys.lists(),
    details: () =>
        [
            ...releaseMergeQueryKeys.all,
            QUERY_KEY.RELEASE_MERGE.GET_DETAIL,
        ] as const,
    detail: (scanId: string) =>
        [...releaseMergeQueryKeys.details(), scanId] as const,
    items: (scanId: string, params?: ReleaseMergeItemFilter) =>
        params
            ? ([
                  ...releaseMergeQueryKeys.all,
                  QUERY_KEY.RELEASE_MERGE.GET_ITEMS,
                  scanId,
                  params,
              ] as const)
            : ([
                  ...releaseMergeQueryKeys.all,
                  QUERY_KEY.RELEASE_MERGE.GET_ITEMS,
                  scanId,
              ] as const),
    item: (scanId: string, itemId: string) =>
        [
            ...releaseMergeQueryKeys.all,
            QUERY_KEY.RELEASE_MERGE.GET_ITEM,
            scanId,
            itemId,
        ] as const,
};
