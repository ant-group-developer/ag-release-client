import { QUERY_KEY } from '@/constants/query-key';

export const statisticQueryKeys = {
    getTopUserCreators: [
        QUERY_KEY.STATISTIC.KEY,
        QUERY_KEY.STATISTIC.TOP_USER_CREATORS,
    ],
    getTopUserCompleted: [
        QUERY_KEY.STATISTIC.KEY,
        QUERY_KEY.STATISTIC.TOP_USER_COMPLETED,
    ],
    exportFile: [QUERY_KEY.STATISTIC.KEY, QUERY_KEY.STATISTIC.EXPORT_FILE],
    getOrderGroupCount: [
        QUERY_KEY.STATISTIC.KEY,
        QUERY_KEY.STATISTIC.GET_ORDER_GROUP_COUNT,
    ],
    getOrderProductGroupCount: [
        QUERY_KEY.STATISTIC.KEY,
        QUERY_KEY.STATISTIC.GET_ORDER_PRODUCT_GROUP_COUNT,
    ],
};
