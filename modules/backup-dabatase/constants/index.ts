import { QUERY_KEY } from '@/constants/query-key';

export const backupDatabaseQueryKeys = {
    all: [QUERY_KEY.SETTING.KEY],
    list: () => [
        ...backupDatabaseQueryKeys.all,
        QUERY_KEY.BACKUP_DATABASE.GET_LIST,
    ],
};
