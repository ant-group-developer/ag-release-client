import { useQuery } from '@tanstack/react-query';
import { releaseMergeApis } from '../apis';
import { releaseMergeQueryKeys } from '../constants/query-keys';
import { RUNNING_RELEASE_MERGE_STATUSES } from '../enums';
import { ReleaseMergeList, ReleaseMergeRun, ReleaseMergeRunFilter } from '../types';

const EMPTY_LIST: ReleaseMergeList<ReleaseMergeRun> = {
    items: [],
    metadata: { page: 1, pageSize: 0, totalItems: 0, totalPages: 0 },
};

export const useGetReleaseMergeScans = (params: ReleaseMergeRunFilter) => {
    const { data, ...res } = useQuery({
        queryKey: releaseMergeQueryKeys.list(params),
        queryFn: () => releaseMergeApis.listScans(params),
        placeholderData: (prev) => prev,
        refetchInterval: (query) => {
            const items = query.state.data?.data?.data?.items ?? [];
            const running = items.some((item) =>
                RUNNING_RELEASE_MERGE_STATUSES.includes(item.status as never)
            );
            return running ? 3000 : false;
        },
    });

    return {
        scanList: data?.data?.data ?? EMPTY_LIST,
        ...res,
    };
};
