import { QUERY_KEY } from '@/constants/query-key';
import { AggregatorDataFilter } from '../types';

export const aggregatorQueryKeys = {
    all: [QUERY_KEY.AGGREGATOR.KEY] as const,
    lists: () =>
        [...aggregatorQueryKeys.all, QUERY_KEY.AGGREGATOR.GET_LIST] as const,
    list: (params: AggregatorDataFilter) =>
        params
            ? [...aggregatorQueryKeys.lists(), params]
            : aggregatorQueryKeys.lists(),
    details: () => [
        ...aggregatorQueryKeys.all,
        QUERY_KEY.AGGREGATOR.GET_DETAIL,
    ],
    detail: (id: string) => [...aggregatorQueryKeys.details(), id],
    update: () => [...aggregatorQueryKeys.all, QUERY_KEY.AGGREGATOR.UPDATE],
};
