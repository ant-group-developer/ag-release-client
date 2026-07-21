export enum LOG_LEVEL {
    SUCCESS = 'SUCCESS',
    LOG = 'LOG',
    ERROR = 'ERROR',
    WARNING = 'WARNING',
}

export enum LOG_TYPE {
    BUSINESS = 'BUSINESS',
    SYSTEM = 'SYSTEM',
}

export enum LOG_SORT_FIELD {
    LOG_CREATED_AT = 'log.createdAt',
    LOG_UPDATED_AT = 'log.updatedAt',
    LOG_LEVEL = 'log.level',
    LOG_TYPE = 'log.type',
    LOG_MODULE = 'log.module',
}
