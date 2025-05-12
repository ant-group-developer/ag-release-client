import { QUERY_KEY } from '@/constants/query-key';

export const groupQueryKeys = {
    all: [QUERY_KEY.GROUP.KEY],
    getList: [QUERY_KEY.GROUP.KEY, QUERY_KEY.GROUP.GET_GROUP_LIST],
    getListAll: [QUERY_KEY.GROUP.KEY, QUERY_KEY.GROUP.GET_GROUP_LIST_ALL],
    getDetail: [QUERY_KEY.GROUP.KEY, QUERY_KEY.GROUP.GET_GROUP_DETAIL],
};
