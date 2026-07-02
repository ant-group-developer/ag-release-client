export enum TYPE_MODAL_REPORT_CONFIG {
    CREATE = 'CREATE_REPORT_CONFIG',
    UPDATE = 'UPDATE_REPORT_CONFIG',
    DELETE = 'DELETE_REPORT_CONFIG',
}

export enum TYPE_MODAL_FTP_EXCLUDE_PATTERN {
    CREATE = 'CREATE_FTP_EXCLUDE_PATTERN',
    UPDATE = 'UPDATE_FTP_EXCLUDE_PATTERN',
    DELETE = 'DELETE_FTP_EXCLUDE_PATTERN',
}

export enum PATTERN_TYPE {
    CONTAINS = 'contains',
    REGEX = 'regex',
}

export enum FTP_EXCLUDE_PATTERN_SCOPE {
    FOLDER = 'folder',
    FILE = 'file',
}

export enum ACTIVE_STATUS {
    ACTIVE = 1,
    INACTIVE = 0,
}

export enum REPORT_IMPORT_TAB {
    CONFIG = 'config-report',
    IMPORT = 'import-report',
    ENRICH_DATA_IMPORT = 'enrich-data-import',
    SFTP = 'import-sftp',
    ENRICH_DATA_CRON = 'enrich-data-cron',
    DELETE_REPORT = 'delete-report',
}

export enum TYPE_MODAL_ENRICH_SCAN_SCHEDULE {
    CREATE = 'CREATE_ENRICH_SCAN_SCHEDULE',
    UPDATE = 'UPDATE_ENRICH_SCAN_SCHEDULE',
    DELETE = 'DELETE_ENRICH_SCAN_SCHEDULE',
}

export enum ETL_JOB_SOURCE_TYPE {
    REPORT_UPLOAD = 'REPORT_UPLOAD',
    FTP_SYNC_PERIOD = 'FTP_SYNC_PERIOD',
    FTP_SYNC_ALL = 'FTP_SYNC_ALL',
    FTP_RETRY = 'FTP_RETRY',
    FTP_AUTO_CRON = 'FTP_AUTO_CRON',
    ANALYTICS_REPORT_EXPORT = 'ANALYTICS_REPORT_EXPORT',
    REPORT_RELEASE_DELETE = 'REPORT_RELEASE_DELETE',
}

export enum ENRICH_SCAN_STATUS {
    PENDING = 'PENDING',
    PROCESSING = 'PROCESSING',
    COMPLETED = 'COMPLETED',
    FAILED = 'FAILED',
    CANCELED = 'CANCELLED',
}

export enum ENRICH_ENTITY_TYPE {
    RELEASE = 'release',
    TRACK = 'track',
    ARTIST = 'artist',
    RELEASE_ARTIST = 'release_artist',
    TRACK_ARTIST = 'track_artist',
}

export enum ENRICH_CHANGE_TYPE {
    CREATE = 'create',
    UPDATE = 'update',
    LINK = 'link',
    MERGE = 'merge',
    SKIP = 'skip',
}

export enum ENRICHMENT_SOURCE {
    SPOTIFY = 'spotify',
    DEEZER = 'deezer',
    LOCAL = 'local',
}

export enum ENRICH_HISTORY_STATUS {
    APPLIED = 'applied',
    DRY_RUN = 'dry_run',
    ERROR = 'error',
}

