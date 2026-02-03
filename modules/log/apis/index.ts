import axiosInstance from '@/api/axios-auth';
import { ListResponse } from '@/types/api';
import { DataFilterLog, LogData } from '../types/data';

export const logApi = {
    getList(params: DataFilterLog) {
        return axiosInstance.get<ListResponse<LogData>>('/log', {
            params,
        });
    },
};
