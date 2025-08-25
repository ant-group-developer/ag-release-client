import axiosInstance from '@/api/axios-auth';
import { PaginationResponse } from '@/types/api';
import { BackupDatabaseLogData, BackupDatabaseLogDataFilter } from '../types';

export const backupDatabaseApis = {
    getBackupDatabaseLogs: (params: BackupDatabaseLogDataFilter) => {
        return axiosInstance.get<PaginationResponse<BackupDatabaseLogData>>(
            '/database',
            { params }
        );
    },

    backupDatabase: () => {
        return axiosInstance.post('/database');
    },
};
