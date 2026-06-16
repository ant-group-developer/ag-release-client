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
}

export enum ETL_JOB_SOURCE_TYPE {
    REPORT_UPLOAD = 'REPORT_UPLOAD',
    FTP_SYNC_PERIOD = 'FTP_SYNC_PERIOD',
    FTP_SYNC_ALL = 'FTP_SYNC_ALL',
    FTP_RETRY = 'FTP_RETRY',
    FTP_AUTO_CRON = 'FTP_AUTO_CRON',
}

export enum ENRICH_SCAN_STATUS {
    PENDING = 'PENDING',
    PROCESSING = 'PROCESSING',
    COMPLETED = 'COMPLETED',
    FAILED = 'FAILED',
}
