import { QUERY_KEY } from '@/constants/query-key';
import type { PrefixUpcDataFilter } from '../types';

export const prefixUpcQueryKeys = {
    all: QUERY_KEY.PREFIX_UPC.KEY,
    lists: () => [
        prefixUpcQueryKeys.all,
        QUERY_KEY.PREFIX_UPC.GET_LIST_PREFIX_UPC,
    ],
    list: (params: PrefixUpcDataFilter) => [
        ...prefixUpcQueryKeys.lists(),
        params,
    ],
};
