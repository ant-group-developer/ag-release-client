import { DEFAULT_DATA_PAGINATION } from '@/constants/common';
import { DATE_FORMAT } from '@/enums/common';
import { formattedDate } from '@/helpers/common';
import { PaginationResponse } from '@/types/api';
import { useQuery } from '@tanstack/react-query';
import { countriesApi } from '../apis';
import { countriesQueryKeys } from '../constants/query-keys';
import { CountriesData, CountriesDataFilter } from '../types';

export const useGetListCountries = (params: CountriesDataFilter) => {
    const { data, ...res } = useQuery({
        queryKey: countriesQueryKeys.list(params),
        queryFn: () => countriesApi.getList(params),
        placeholderData: (previousData) => previousData,
        refetchOnWindowFocus: false,
    });

    const dataCountries: PaginationResponse<CountriesData>['data'] =
        data?.data?.data ?? DEFAULT_DATA_PAGINATION;

    const lastUpdatedAt = formattedDate(
        res.dataUpdatedAt,
        DATE_FORMAT.HOUR_MINUTE_SECOND
    );

    return {
        countriesData: dataCountries,
        lastUpdatedAt,
        ...res,
    };
};
