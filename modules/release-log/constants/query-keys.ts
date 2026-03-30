import { QUERY_KEY } from '@/constants/query-key';
import { ReleaseLogFilter } from '../types';

export const releaseLogQueryKeys = {
    all: QUERY_KEY.RELEASE_LOG.KEY,
    getList: () => [releaseLogQueryKeys.all, QUERY_KEY.RELEASE_LOG.GET_LIST],
    getLists: (params: ReleaseLogFilter) => [
        ...releaseLogQueryKeys.getList(),
        params,
    ],
};
