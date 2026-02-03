import { QUERY_KEY } from '@/constants/query-key';
import { RevenueDataFilter } from '../types';

export const trackRevenueQueryKeys = {
    all: [QUERY_KEY.TRACK_REVENUE.KEY] as const,

    lists: () =>
        [
            ...trackRevenueQueryKeys.all,
            QUERY_KEY.TRACK_REVENUE.GET_LIST,
        ] as const,
    list: (params?: RevenueDataFilter) =>
        params
            ? ([...trackRevenueQueryKeys.lists(), params] as const)
            : trackRevenueQueryKeys.lists(),
};
