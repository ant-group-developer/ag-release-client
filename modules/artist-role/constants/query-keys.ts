import { QUERY_KEY } from '@/constants/query-key';
import { ArtistRoleDataFilter } from '../types';

export const artistRoleQueryKeys = {
    all: [QUERY_KEY.ARTIST_ROLE.KEY],
    list: () => [...artistRoleQueryKeys.all, QUERY_KEY.ARTIST_ROLE.GET_LIST],
    listSimple: () => [
        ...artistRoleQueryKeys.all,
        QUERY_KEY.ARTIST_ROLE.GET_LIST_SIMPLE,
    ],
    lists: (params: ArtistRoleDataFilter) => {
        const result: any[] = [...artistRoleQueryKeys.list()];
        if (params) {
            result.push(params);
        }
        return result;
    },
    getDetail: [QUERY_KEY.ARTIST_ROLE.KEY, QUERY_KEY.ARTIST_ROLE.GET_DETAIL],
    details: () => [
        ...artistRoleQueryKeys.all,
        QUERY_KEY.ARTIST_ROLE.GET_DETAIL,
    ],
    detail: (id: string) => [...artistRoleQueryKeys.details(), id],
};
