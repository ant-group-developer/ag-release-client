export enum FTP_REPORT_FILE_RULE_STATUS {
    PENDING = 'pending',
    IMPORT = 'import',
    IGNORE = 'ignore',
}

export enum FTP_REPORT_FILE_RULE_SOURCE_CATEGORY {
    TRENDS = 'trends',
    USAGE = 'usage',
    SALES = 'sales',
    ILLEGITIMATE_ACTIVITY = 'illegitimate_activity',
}

export enum TARGET_COLUMN {
    SKIP = 'skip',
    METADATA = 'metadata',
    REPORTING_PERIOD = 'reporting_period',
    REPORTING_PERIOD_START = 'reporting_period_start',
    REPORTING_PERIOD_END = 'reporting_period_end',
    TERRITORY_CODE = 'territory_code',
    ISRC = 'isrc',
    UPC = 'upc',
    TRACK_TITLE = 'track_title',
    ARTIST_NAME = 'artist_name',
    ALBUM_TITLE = 'album_title',
    COMPOSER_NAME = 'composer_name',
    TRACK_ID_INTERNAL = 'track_id_internal',
    QUANTITY_TOTAL = 'quantity_total',
    QUANTITY_UNIQUE_USERS = 'quantity_unique_users',
    QUANTITY_INVALID = 'quantity_invalid',
    QUANTITY = 'quantity',
    QUANTITY_CREATIONS = 'quantity_creations',
    QUANTITY_VIEWS = 'quantity_views',
    REVENUE_USD = 'revenue_usd',
    REVENUE_LOCAL = 'revenue_local',
    REVENUE_CURRENCY = 'revenue_currency',
}

export const TARGET_COLUMN_OPTIONS = Object.values(TARGET_COLUMN).map(
    (value) => ({
        label: value,
        value,
    })
);

export enum TRANSFORM_TYPE {
    TRIM = 'trim',
    RAW = 'raw',
    UPPERCASE = 'uppercase',
    LOWERCASE = 'lowercase',
    ISRC = 'isrc',
}

export const TRANSFORM_TYPE_OPTIONS = Object.values(TRANSFORM_TYPE).map(
    (value) => ({
        label: value,
        value,
    })
);

