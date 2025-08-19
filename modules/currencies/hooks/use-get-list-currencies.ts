import { DEFAULT_DATA_PAGINATION } from '@/constants/common';
import { PaginationResponse } from '@/types/api';
import { useQuery } from '@tanstack/react-query';
import { currenciesApis } from '../apis';
import { currenciesQueryKeys } from '../constants/query-keys';
import { CurrenciesData, CurrenciesDataFilter } from '../types';

export const useGetListCurrencies = (params: CurrenciesDataFilter) => {
    const { data, ...res } = useQuery({
        queryKey: currenciesQueryKeys.list(params),
        queryFn: () => currenciesApis.getList(params),
        placeholderData: (prev) => prev,
    });

    const currenciesData =
        data?.data?.data ??
        (DEFAULT_DATA_PAGINATION as PaginationResponse<CurrenciesData>['data']);

    return {
        currenciesData,
        ...res,
    };
};
