import { QUERY_KEY } from '@/constants/query-key';
import { BackupDatabaseLogDataFilter } from '../types';

export const backupDatabaseQueryKeys = {
    all: [QUERY_KEY.SETTING.KEY],
    lists: () => [
        ...backupDatabaseQueryKeys.all,
        QUERY_KEY.BACKUP_DATABASE.GET_LIST,
    ],
    list: (params: BackupDatabaseLogDataFilter) => [
        backupDatabaseQueryKeys.lists,
        params,
    ],
};
