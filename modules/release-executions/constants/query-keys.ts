import { QUERY_KEY } from '@/constants/query-key';
import { ReleaseExecutionFilter } from '../types';

export const releaseExecutionQueryKeys = {
    all: QUERY_KEY.RELEASE_EXECUTION.KEY,
    getList: () => [
        releaseExecutionQueryKeys.all,
        QUERY_KEY.RELEASE_EXECUTION.GET_LIST,
    ],
    details: () => [releaseExecutionQueryKeys.all, 'DETAIL'],
    detail: (id: string) => [...releaseExecutionQueryKeys.details(), id],
    retry: () => [
        releaseExecutionQueryKeys.all,
        QUERY_KEY.RELEASE_EXECUTION.RETRY,
    ],
    getLists: (params: ReleaseExecutionFilter) => [
        ...releaseExecutionQueryKeys.getList(),
        params,
    ],
};
