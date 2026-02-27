import { DEFAULT_DATA_PAGINATION } from '@/constants/common';
import { PaginationResponse } from '@/types/api';
import { useQuery } from '@tanstack/react-query';
import { prefixUpcApis } from '../apis';
import { prefixUpcQueryKeys } from '../constants/query-keys';
import { PrefixUpcData, PrefixUpcDataFilter } from '../types';

export const useGetListPrefixUpc = (params: PrefixUpcDataFilter) => {
    const { data, ...res } = useQuery({
        queryKey: prefixUpcQueryKeys.list(params),
        queryFn: () => prefixUpcApis.getList(params),
        placeholderData: (prev) => prev,
    });

    return {
        prefixUpcData:
            data?.data?.data ??
            (DEFAULT_DATA_PAGINATION as PaginationResponse<PrefixUpcData>['data']),
        ...res,
    };
};
