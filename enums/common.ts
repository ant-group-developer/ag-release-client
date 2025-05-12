export enum LOCALE {
    EN = 'en',
    VI = 'vi',
}

export enum THEME {
    LIGHT = 'light',
    DARK = 'dark',
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
    GROUP = 'group',
    KEYWORD = 'keyword',
    TOPIC = 'topic',
    IS_ACTIVE = 'is_active',
    CREATOR = 'creator',
    ASSIGNEE = 'assignee',
    APPROVER = 'approver',
    STATUS = 'status',
    TYPE = 'type',
    DEADLINE = 'deadline',
    DROPDOWN = 'dropdown',
    USE_STATUS = 'usedStatus',
    DATE_CREATED = 'dateCreated',
    PRIORITY = 'priority',
    PRODUCT_TYPE = 'productType',
}

export enum COMMENT_RATING_TAB_KEY {
    IMAGE = 'image',
    VIDEO = 'video',
    VIDEO_AND_THUMBNAIL = 'thumb_video',
    SOURCE = 'source',
    HISTORY = 'history',
}

export enum UPLOAD_TYPE {
    IMAGE = 'image',
    VIDEO = 'video',
    THUMB_VIDEO = 'thumb_video',
    SOURCE = 'source',
    MP3 = 'mp3',
}

export enum Orientation {
    HORIZONTAL = 'horizontal',
    VERTICAL = 'vertical',
}

export enum ACTIVE_TYPE {
    ON = 'true',
    OFF = 'false',
}

export enum MODULE_NAME {
    ORDER = 'order',
    PRODUCT = 'product',
    TOPIC = 'topic',
    STATISTIC = 'statistic',
    PERMISSION = 'permission',
}

export enum LOCAL_STORAGE_KEY {
    VISIBLE_COLUMNS_ORDER = 'visible_columns_order',
    VISIBLE_COLUMNS_PRODUCT = 'visible_columns_product',
    OPEN_SIDE_BAR = 'open_side_bar',
    LAYOUT_TABLE = 'layout_table',
    TOPIC_SETTING_TAB_VALUE = 'topic_setting_tab_value',
}

export enum SESSION_STORAGE_KEY {
    VISIBLE_COLUMNS_ORDER = 'visible_columns_order',
    VISIBLE_COLUMNS_PRODUCT = 'visible_columns_product',
    TOPIC_SETTING_TAB_VALUE = 'topic_setting_tab_value',
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
