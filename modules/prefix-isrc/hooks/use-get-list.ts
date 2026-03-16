import { DEFAULT_DATA_PAGINATION } from '@/constants/common';
import { PaginationResponse } from '@/types/api';
import { useQuery } from '@tanstack/react-query';
import { prefixIsrcApis } from '../apis';
import { prefixIsrcQueryKeys } from '../constants/query-keys';
import type { PrefixIsrcData, PrefixIsrcDataFilter } from '../types';

export const useGetListPrefixIsrc = (params: PrefixIsrcDataFilter) => {
    const { data, ...res } = useQuery({
        queryKey: prefixIsrcQueryKeys.list(params),
        queryFn: () => prefixIsrcApis.getList(params),
        placeholderData: (prev) => prev,
    });

    return {
        prefixIsrcData:
            data?.data?.data ??
            (DEFAULT_DATA_PAGINATION as PaginationResponse<PrefixIsrcData>['data']),
        ...res,
    };
};
