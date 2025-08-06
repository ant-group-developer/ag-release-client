import { QUERY_KEY } from '@/constants/query-key';

export const trackQueryKeys = {
    getList: [QUERY_KEY.TRACK.KEY, QUERY_KEY.TRACK.GET_LIST],
    getListByReleaseId: [
        QUERY_KEY.TRACK.KEY,
        QUERY_KEY.TRACK.GET_LIST_BY_RELEASE_ID,
    ],
    getDetail: [QUERY_KEY.TRACK.KEY, QUERY_KEY.TRACK.GET_DETAIL],
};
