import { QUERY_KEY } from '@/constants/query-key';
import { DealTypeDataFilter } from '../types';

export const dealTypeQueryKeys = {
    all: [QUERY_KEY.DEAL_TYPE.KEY] as const,
    lists: () =>
        [...dealTypeQueryKeys.all, QUERY_KEY.DEAL_TYPE.GET_LIST] as const,
    list: (params?: DealTypeDataFilter) =>
        params
            ? ([...dealTypeQueryKeys.lists(), params] as const)
            : dealTypeQueryKeys.lists(),
};
