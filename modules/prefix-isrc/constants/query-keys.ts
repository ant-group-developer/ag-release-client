import { QUERY_KEY } from '@/constants/query-key';
import type { PrefixIsrcDataFilter } from '../types';

export const prefixIsrcQueryKeys = {
    all: QUERY_KEY.PREFIX_ISRC.KEY,
    lists: () => [
        prefixIsrcQueryKeys.all,
        QUERY_KEY.PREFIX_ISRC.GET_LIST_PREFIX_ISRC,
    ],
    list: (params: PrefixIsrcDataFilter) => [
        ...prefixIsrcQueryKeys.lists(),
        params,
    ],
};
