export enum RELEASE_CI_DATA_COLUMNS_DISPLAY {
    CREATED_AT = 'releaseCiData.createdAt',
    UPDATED_AT = 'releaseCiData.updatedAt',
    STATUS = 'releaseCiData.status',
    LATEST_SYNCED_AT = 'releaseCiData.latestSyncedAt',
    IMPORT_COUNT = 'releaseCiData.importCount',
    IMPORT_STATUS = 'common.importStatus',
}

export enum RELEASE_CI_DATA_STATUS {
    EXISTS_ON_CI = 'EXISTS_ON_CI',
    NOT_FOUND_ON_CI = 'NOT_FOUND_ON_CI',
}

export enum RELEASE_CI_IMPORT_STATUS {
    COMPLETE = 'complete',
    PROBLEM = 'problem',
}

export enum RELEASE_CI_EXPORT_STATUS {
    SYSFAIL = 'sysfail',
    INVALID = 'invalid',
    COMPLETE = 'complete',
    LIVE = 'live',
}
