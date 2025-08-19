import { QUERY_KEY } from '@/constants/query-key';
import { PriceTiersDataFilter } from '../types';

export const priceTiersQueryKeys = {
    all: [QUERY_KEY.PRICE_TIERS.KEY] as const,
    lists: () =>
        [...priceTiersQueryKeys.all, QUERY_KEY.PRICE_TIERS.GET_LIST] as const,
    list: (params?: PriceTiersDataFilter) =>
        params
            ? ([...priceTiersQueryKeys.lists(), params] as const)
            : priceTiersQueryKeys.lists(),

    details: () =>
        [...priceTiersQueryKeys.all, QUERY_KEY.PRICE_TIERS.GET_DETAIL] as const,
    detail: (id: string) => [...priceTiersQueryKeys.details(), id] as const,
    updates: () =>
        [...priceTiersQueryKeys.all, QUERY_KEY.PRICE_TIERS.UPDATE] as const,
};
