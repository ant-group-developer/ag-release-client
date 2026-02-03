import { QUERY_KEY } from '@/constants/query-key';
import { CurrenciesDataFilter } from '../types';

export const currenciesQueryKeys = {
    all: [QUERY_KEY.CURRENCIES.KEY] as const,
    lists: () =>
        [...currenciesQueryKeys.all, QUERY_KEY.CURRENCIES.GET_LIST] as const,
    listsSimple: () =>
        [
            ...currenciesQueryKeys.all,
            QUERY_KEY.CURRENCIES.GET_LIST_SIMPLE,
        ] as const,
    list: (params?: CurrenciesDataFilter) =>
        params
            ? ([...currenciesQueryKeys.lists(), params] as const)
            : currenciesQueryKeys.lists(),

    details: () =>
        [...currenciesQueryKeys.all, QUERY_KEY.CURRENCIES.GET_DETAIL] as const,
    detail: (id: string) => [...currenciesQueryKeys.details(), id] as const,
};
