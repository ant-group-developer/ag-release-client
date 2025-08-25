import { DEFAULT_DATA_PAGINATION } from '@/constants/common';
import { PaginationResponse } from '@/types/api';
import { useQuery } from '@tanstack/react-query';
import { backupDatabaseApis } from '../apis';
import { backupDatabaseQueryKeys } from '../constants';
import { BackupDatabaseLogData, BackupDatabaseLogDataFilter } from '../types';

export const useListBackupDatabaseLogs = (
    params: BackupDatabaseLogDataFilter
) => {
    const { data, ...res } = useQuery({
        queryKey: backupDatabaseQueryKeys.list(params),
        queryFn: () => backupDatabaseApis.getBackupDatabaseLogs(),
    });

    return {
        backupDatabaseLogsData:
            data?.data?.data ??
            (DEFAULT_DATA_PAGINATION as PaginationResponse<BackupDatabaseLogData>['data']),
        ...res,
    };
};
