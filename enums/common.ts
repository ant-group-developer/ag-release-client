export enum LOCALE {
    EN = 'en',
    VI = 'vi',
}

export enum THEME {
    LIGHT = 'light',
    DARK = 'dark',
    SYSTEM = 'system',
}

export enum PASSWORD_LENGTH {
    MAX = 12,
    MIN = 6,
}

export enum NAME_LENGTH {
    MAX = 50,
    MIN = 2,
}

export enum ROLE {
    ADMIN = 'admin',
    USER = 'user',
}

export enum STATUS {
    ACTIVE = 1,
    BLOCKED = 2,
}

export enum PLAYLIST_STATUS {
    OPEN = 'Open',
    LOCK = 'Lock',
}

export enum SCREEN {
    SM = 576,
    MD = 768,
    LG = 992,
    XL = 1200,
    XXL = 1400,
    XXXL = 1600,
}

export enum TYPE_GRAPH {
    MONTH = 'month',
    YEAR = 'year',
    DAY = 'day',
}

export enum TYPE_SELECT {
    LAST_7_DAY = 'last_7_day',
    THIS_MONTH = 'this_month',
    LAST_MONTH = 'last_month',
    LAST_YEAR = 'last_year',
    THIS_YEAR = 'this_year',
    LAST_5_YEAR = 'last_5_year',
}

export enum DATE_FORMAT {
    DATE_ONLY = 'DD/MM/YYYY',
    FULL = 'HH:mm:ss DD/MM/YYYY',
    DATE_MINUTE = 'HH:mm DD/MM/YYYY',
    MONTH_YEAR = 'MM/YYYY',
    YEAR = 'YYYY',
    DATE_ONLY_REVERSE = 'YYYY/MM/DD',
    MYSQL_TYPE_DATE = 'YYYY-MM-DD',
    REPORT = 'MMMM DD, YYYY',
    DATE_MONTH = 'DD/MM',
    HOUR_MINUTE = 'HH:mm:ss',
    YEAR_MONTH_DAY_TIME = 'YYYY-MM-DD HH:mm:ss',
}

export enum FILE_TYPE {
    FREE = 'NotPay',
    PREMIUM = 'Pay',
}

export enum ORDER {
    DESC = 'DESC',
    ASC = 'ASC',
}

export enum BOOLEAN_RAW {
    TRUE = 1,
    FALSE = 0,
}

export enum BOOLEAN_TEXT {
    TRUE = 'true',
    FALSE = 'false',
}

export enum TYPE_NOTIFICATION {
    SUCCESS = 'success',
    ERROR = 'error',
}

export enum TYPE_FILTER {
    KEYWORD = 'keyword',
    IS_ACTIVE = 'is_active',
    CREATOR = 'creator',
    STATUS = 'status',
    TYPE = 'type',
    DROPDOWN = 'dropdown',
    DATE_CREATED = 'dateCreated',
    DATE_UPDATED = 'dateUpdated',
    DATE_RELEASE = 'dateRelease',
    GENRES = 'genres',
    ID = 'ID',
}

export enum UPLOAD_TYPE {
    IMAGE = 'image',
    VIDEO = 'video',
    THUMB_VIDEO = 'thumb_video',
    SOURCE = 'source',
    MP3 = 'mp3',
}

export enum ACTIVE_TYPE {
    ON = 'true',
    OFF = 'false',
}

export enum LOCAL_STORAGE_KEY {
    OPEN_SIDE_BAR = 'open_side_bar',
    LAYOUT_TABLE = 'layout_table',
    THEME = 'theme',
}

export enum SESSION_STORAGE_KEY {
    VISIBLE_COLUMNS_RELEASES = 'visible_columns_releases',
    VISIBLE_COLUMNS_TRACKS = 'visible_columns_tracks',
    VISIBLE_COLUMNS_DISTRIBUTION = 'visible_columns_distribution',
}

export enum FIELD_TYPE {
    INPUT = 'input',
    FILE = 'file',
}

export enum ACCEPT_FILE {
    IMAGE = 'image/*',
    VIDEO = 'video/*',
}

export enum LAYOUT_TABLE {
    LIST = 'list',
    GRID = 'grid',
}

export enum ORIENTATION {
    HORIZONTAL = 'horizontal',
    VERTICAL = 'vertical',
}

export enum TYPE_MODAL {
    SEARCH = 'SEARCH',
}

export enum TYPE_UPLOAD_BUCKET {
    JSON = 'peak_audio',
    TRACK = 'track_audio',
    RELEASE_COVER_ART = 'release_cover_art',
}
