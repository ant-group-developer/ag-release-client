import { QUERY_KEY } from '@/constants/query-key';
import { ArtistDataFilter } from '../types';

export const artistQueryKeys = {
    all: [QUERY_KEY.ARTIST.KEY],
    lists: () => [...artistQueryKeys.all, QUERY_KEY.ARTIST.GET_LIST],
    list: (params: ArtistDataFilter) =>
        params ? [...artistQueryKeys.lists(), params] : artistQueryKeys.lists(),
    getDetails: () => [...artistQueryKeys.all, QUERY_KEY.ARTIST.GET_DETAIL],
    detail: (id: string) => [...artistQueryKeys.getDetails(), id],
    listsSimple: () => [
        ...artistQueryKeys.all,
        QUERY_KEY.ARTIST.GET_LIST_SIMPLE,
    ],
    listSimple: (params: ArtistDataFilter) =>
        params
            ? [...artistQueryKeys.lists(), params]
            : artistQueryKeys.listsSimple(),
};
