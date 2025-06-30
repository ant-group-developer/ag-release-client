import { QUERY_KEY } from '@/constants/query-key';

export const genreQueryKeys = {
    all: [QUERY_KEY.GENRE],
    getList: [QUERY_KEY.GENRE, QUERY_KEY.GENRE.GET_LIST],
    getDetail: [QUERY_KEY.GENRE, QUERY_KEY.GENRE.GET_DETAIL],
};
