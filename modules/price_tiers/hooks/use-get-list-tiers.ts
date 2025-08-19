import { DEFAULT_DATA_PAGINATION } from '@/constants/common';
import { PaginationResponse } from '@/types/api';
import { useQuery } from '@tanstack/react-query';
import { priceTiersApis } from '../apis';
import { priceTiersQueryKeys } from '../constants/query-keys';
import { PriceTiersData, PriceTiersDataFilter } from '../types';

export const useGetListPriceTiers = (params: PriceTiersDataFilter) => {
    const { data, ...res } = useQuery({
        queryKey: priceTiersQueryKeys.list(params),
        queryFn: () => priceTiersApis.getList(params),
        placeholderData: (prev) => prev,
    });

    const priceTiersData =
        data?.data?.data ??
        (DEFAULT_DATA_PAGINATION as PaginationResponse<PriceTiersData>['data']);

    return {
        priceTiersData,
        ...res,
    };
};
