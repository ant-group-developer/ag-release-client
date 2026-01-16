import { DEFAULT_DATA_PAGINATION } from '@/constants/common';
import { PaginationResponse } from '@/types/api';
import { useQuery } from '@tanstack/react-query';

import { aggregatorApis } from '../apis';
import { aggregatorQueryKeys } from '../constants/query-keys';
import { AggregatorData, AggregatorDataFilter } from '../types';

export const useGetListAggregator = (params: AggregatorDataFilter) => {
    const { data, ...res } = useQuery({
        queryKey: aggregatorQueryKeys.list(params),
        queryFn: () => aggregatorApis.getList(params),
        placeholderData: (prev) => prev,
    });

    const aggregatorsData =
        data?.data?.data ??
        (DEFAULT_DATA_PAGINATION as PaginationResponse<AggregatorData>['data']);

    return {
        aggregatorsData,
        ...res,
    };
};
