import axiosInstance from '@/api/axios-auth';
import { DetailResponse, PaginationResponse } from '@/types/api';
import { DataFilterLogs, LogsData } from '../types/data';

export const logApi = {
    getListLogs(params: DataFilterLogs) {
        const { level, type, ...rest } = params;
        const serializedParams = {
            ...rest,
            level: Array.isArray(level) ? level.join(',') : level,
            type: Array.isArray(type) ? type.join(',') : type,
        };
        return axiosInstance.get<PaginationResponse<LogsData>>('/logs', {
            params: serializedParams,
        });
    },

    getListModules() {
        return axiosInstance.get<DetailResponse<string[]> | string[]>('/logs/modules');
    },
};
