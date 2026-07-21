import { QUERY_KEY } from '@/constants/query-key';
import { LOG_LEVEL, LOG_TYPE } from '../enums';
import { DataFilterLogs } from '../types/data';

export const logQueryKeys = {
    all: QUERY_KEY.LOG.KEY,
    getListLogs: () => [QUERY_KEY.LOG.KEY, QUERY_KEY.LOG.GET_LOGS_LIST],
    getLogsList: (params: DataFilterLogs) => [
        ...logQueryKeys.getListLogs(),
        params,
    ],
    getListModules: () => [QUERY_KEY.LOG.KEY, QUERY_KEY.LOG.GET_LOGS_MODULES],
};

export const LOG_LEVEL_MSG_KEY: Record<LOG_LEVEL, string> = {
    [LOG_LEVEL.SUCCESS]: 'log.level.success',
    [LOG_LEVEL.INFO]: 'log.level.info',
    [LOG_LEVEL.WARNING]: 'log.level.warning',
    [LOG_LEVEL.ERROR]: 'log.level.error',
};

export const LOG_TYPE_MSG_KEY: Record<LOG_TYPE, string> = {
    [LOG_TYPE.BUSINESS]: 'log.type.business',
    [LOG_TYPE.SYSTEM]: 'log.type.system',
};
