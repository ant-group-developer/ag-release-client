import axiosInstance from '@/api/axios-auth';
import { PaginationResponse } from '@/types/api';
import { BackupDatabaseLogData } from '../types';

export const backupDatabaseApis = {
    getBackupDatabaseLogs: () => {
        return axiosInstance.get<PaginationResponse<BackupDatabaseLogData>>(
            '/database'
        );
    },
};
