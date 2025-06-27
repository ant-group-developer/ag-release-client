import { QUERY_KEY } from '@/constants/query-key';

export const countriesQueryKeys = {
    all: [QUERY_KEY.COUNTRIES.KEY],
    getList: [QUERY_KEY.COUNTRIES.KEY, QUERY_KEY.COUNTRIES.GET_LIST],
    getDetail: [QUERY_KEY.COUNTRIES.KEY, QUERY_KEY.COUNTRIES.GET_DETAIL],
};
