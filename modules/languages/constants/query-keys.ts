import { QUERY_KEY } from '@/constants/query-key';
import { LanguageDataFilter } from '../types';

export const languageQueryKeys = {
    all: [QUERY_KEY.LANGUAGE.KEY] as const,

    lists: () =>
        [...languageQueryKeys.all, QUERY_KEY.LANGUAGE.GET_LIST] as const,
    list: (params?: LanguageDataFilter) =>
        params
            ? ([...languageQueryKeys.lists(), params] as const)
            : languageQueryKeys.lists(),

    details: () =>
        [...languageQueryKeys.all, QUERY_KEY.LANGUAGE.GET_DETAIL] as const,
    detail: (id: string) => [...languageQueryKeys.details(), id] as const,
};
