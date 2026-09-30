import { useQuery } from '@tanstack/react-query';
import { releaseMergeApis } from '../apis';
import { releaseMergeQueryKeys } from '../constants/query-keys';
import { RUNNING_RELEASE_MERGE_STATUSES } from '../enums';
import {
    ReleaseMergeItem,
    ReleaseMergeItemFilter,
    ReleaseMergeList,
} from '../types';

const EMPTY_LIST: ReleaseMergeList<ReleaseMergeItem> = {
    items: [],
    metadata: { page: 1, pageSize: 0, totalItems: 0, totalPages: 0 },
};

export const useGetReleaseMergeItems = (
    scanId?: string | null,
    params?: ReleaseMergeItemFilter,
    scanStatus?: string | null
) => {
    const { data, ...res } = useQuery({
        queryKey: releaseMergeQueryKeys.items(scanId ?? '', params),
        queryFn: () =>
            releaseMergeApis.listItems(scanId as string, params ?? {}),
        enabled: !!scanId,
        placeholderData: (prev) => prev,
        refetchInterval: RUNNING_RELEASE_MERGE_STATUSES.includes(
            scanStatus as never
        )
            ? 2000
            : false,
    });

    return {
        itemList: data?.data?.data ?? EMPTY_LIST,
        ...res,
    };
};
