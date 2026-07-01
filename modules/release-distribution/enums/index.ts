export enum RELEASE_CI_DATA_COLUMNS_DISPLAY {
    CREATED_AT = 'releaseCiData.createdAt',
    UPDATED_AT = 'releaseCiData.updatedAt',
    STATUS = 'releaseCiData.status',
    LATEST_SYNCED_AT = 'releaseCiData.latestSyncedAt',
}

export enum RELEASE_CI_DATA_STATUS {
    EXISTS_ON_CI = 'EXISTS_ON_CI',
    NOT_FOUND_ON_CI = 'NOT_FOUND_ON_CI',
}
