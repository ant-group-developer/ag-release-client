import { QUERY_KEY } from '@/constants/query-key';
import { NewsCategoryDataFilter } from '../types';

export const newsCategoryQueryKeys = {
    all: [QUERY_KEY.NEWS_CATEGORY.KEY] as const,
    lists: () =>
        [
            ...newsCategoryQueryKeys.all,
            QUERY_KEY.NEWS_CATEGORY.GET_LIST,
        ] as const,
    list: (params?: NewsCategoryDataFilter) =>
        params
            ? ([...newsCategoryQueryKeys.lists(), params] as const)
            : newsCategoryQueryKeys.lists(),
};
