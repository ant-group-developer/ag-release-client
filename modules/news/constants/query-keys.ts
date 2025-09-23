import { QUERY_KEY } from '@/constants/query-key';
import { NewsDataFilter } from '../types';

export const newsQueryKeys = {
    all: [QUERY_KEY.NEWS.KEY] as const,
    lists: () => [...newsQueryKeys.all, QUERY_KEY.NEWS.GET_LIST] as const,
    list: (params?: NewsDataFilter) =>
        params
            ? ([...newsQueryKeys.lists(), params] as const)
            : newsQueryKeys.lists(),
    getKeywords: () => [...newsQueryKeys.all, 'keywords'],
};
