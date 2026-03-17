import axiosInstance from '@/api/axios-auth';
import { ListResponse } from '@/types/api';
import { BatchImportLogData, BatchImportLogFilter } from '../types/data';

export const batchImportApi = {
    getLogs(params: BatchImportLogFilter) {
        return axiosInstance.get<ListResponse<BatchImportLogData>>(
            '/batch-import/logs',
            { params },
        );
    },
};
