import axiosAuth from '@/api/axios-auth';
import { ListResponse } from '@/types/api';
import { DataFilterLog, LogData } from '../types/data';

export const logApi = {
    getList(params: DataFilterLog) {
        return axiosAuth.get<ListResponse<LogData>>('/log', {
            params,
        });
    },
};
