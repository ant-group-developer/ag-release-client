import { QUERY_KEY } from '@/constants/query-key';

export const productManagementQueryKeys = {
    all: QUERY_KEY.PRODUCT_MANAGEMENT.KEY,
    getList: [
        QUERY_KEY.PRODUCT_MANAGEMENT.KEY,
        QUERY_KEY.PRODUCT_MANAGEMENT.GET_PRODUCT_MANAGEMENT_LIST,
    ],
    exportFile: [
        QUERY_KEY.PRODUCT_MANAGEMENT.KEY,
        QUERY_KEY.PRODUCT_MANAGEMENT.EXPORT_FILE,
    ],
};
