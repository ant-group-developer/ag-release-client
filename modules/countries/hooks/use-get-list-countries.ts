import { DEFAULT_DATA_PAGINATION } from '@/constants/common';
import { PaginationResponse } from '@/types/api';
import { useQuery } from '@tanstack/react-query';
import { countriesApi } from '../apis';
import { countriesQueryKeys } from '../constants/query-keys';
import { CountriesData, CountriesDataFilter } from '../types';

export const useGetListCountries = (params: CountriesDataFilter) => {
    const { data, ...res } = useQuery({
        queryKey: [countriesQueryKeys.getList, params],
        queryFn: () => countriesApi.getList(params),
        refetchOnWindowFocus: false,
    });

    const dataCountries: PaginationResponse<CountriesData>['data'] =
        data?.data?.data ?? DEFAULT_DATA_PAGINATION;

    return {
        countriesData: dataCountries,
        ...res,
    };
};
