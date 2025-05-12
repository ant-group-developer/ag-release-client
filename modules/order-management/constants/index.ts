import { QUERY_KEY } from '@/constants/query-key';

export const orderManagementQueryKeys = {
    all: QUERY_KEY.ORDER_MANAGEMENT.KEY,
    getList: [
        QUERY_KEY.ORDER_MANAGEMENT.KEY,
        QUERY_KEY.ORDER_MANAGEMENT.GET_ORDER_MANAGEMENT_LIST,
    ],
    exportFile: [
        QUERY_KEY.ORDER_MANAGEMENT.KEY,
        QUERY_KEY.ORDER_MANAGEMENT.EXPORT_FILE,
    ],
};
