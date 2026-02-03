import { QUERY_KEY } from '@/constants/query-key';
import { GenresDataFilter } from '../types';

export const genreQueryKeys = {
    all: [QUERY_KEY.GENRE.KEY] as const,

    lists: () => [...genreQueryKeys.all, QUERY_KEY.GENRE.GET_LIST] as const,
    listsSimple: () =>
        [...genreQueryKeys.all, QUERY_KEY.GENRE.GET_LIST_SIMPLE] as const,
    list: (params?: GenresDataFilter) =>
        params
            ? ([...genreQueryKeys.lists(), params] as const)
            : genreQueryKeys.lists(),

    details: () => [...genreQueryKeys.all, QUERY_KEY.GENRE.GET_DETAIL] as const,
    detail: (id: string) => [...genreQueryKeys.details(), id] as const,
};
