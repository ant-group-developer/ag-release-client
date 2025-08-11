import { QUERY_KEY } from '@/constants/query-key';
import { CountriesDataFilter } from '../types';

export const countriesQueryKeys = {
    all: [QUERY_KEY.COUNTRIES.KEY],
    lists: () => [...countriesQueryKeys.all, QUERY_KEY.COUNTRIES.GET_LIST],
    list: (params?: CountriesDataFilter) =>
        params
            ? [...countriesQueryKeys.lists(), params]
            : countriesQueryKeys.lists(),
    details: () => [...countriesQueryKeys.all, QUERY_KEY.COUNTRIES.GET_DETAIL],
    detail: (id: string) => [...countriesQueryKeys.details(), id],
};
