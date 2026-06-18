export enum RELEASES_TYPE {
    ALBUM = 'album',
    SINGLE = 'single',
    EP = 'ep',
}

export enum TYPE_MODAL_RELEASE {
    CREATE = 'CREATE_RELEASE',
    UPDATE = 'UPDATE_RELEASE',
    DELETE = 'DELETE_RELEASE',
    DETAIL = 'DETAIL_RELEASE',
    ADD_TRACK = 'ADD_TRACK_RELEASE',
    SYNC_TO_TRACKS = 'SYNC_TO_TRACKS_RELEASE',
    DETAIL_TRACK_RELEASE = 'DETAIL_TRACK_RELEASE',
    UPLOAD_TEMPLATE = 'UPLOAD_TEMPLATE',
    EXPORT_TEMPLATE = 'EXPORT_TEMPLATE',
    BULK_SUBMIT = 'BULK_SUBMIT_RELEASE',
    BULK_DELETE = 'BULK_DELETE_RELEASE',
}

export enum RELEASE_ROUTE_ACTION {
    CREATE = 'create',
    DETAIL = 'detail',
}

export enum TYPE_MODAL_TRACK {
    ADD = 'ADD',
    DELETE = 'DELETE',
    BULK_DELETE = 'BULK_DELETE',
    BULK_UPDATE = 'BULK_UPDATE',
    ACR_CLOUD_SCAN = 'ACR_CLOUD_SCAN',
    ACR_CLOUD_SCAN_HISTORY = 'ACR_CLOUD_SCAN_HISTORY',
    ACR_CLOUD_SCAN_RESULT = 'ACR_CLOUD_SCAN_RESULT',
}

export enum TYPE_MODAL_RELEASE_ARTIST_LIST {
    ADD_ARTIST = 'ADD_ARTIST_RELEASE',
    EDIT_ARTIST = 'EDIT_ARTIST_RELEASE',
    DELETE_ARTIST = 'DELETE_ARTIST_RELEASE',
}

export enum TYPE_MODAL_RELEASE_TRACK_ARTIST_LIST {
    ADD_ARTIST = 'ADD_ARTIST_TRACK_RELEASE',
    EDIT_ARTIST = 'EDIT_ARTIST_TRACK_RELEASE',
    DELETE_ARTIST = 'DELETE_ARTIST_TRACK_RELEASE',
}

export enum TYPE_MODAL_RELEASE_CONTRIBUTOR_LIST {
    ADD_CONTRIBUTOR = 'ADD_CONTRIBUTOR_RELEASE',
}

export enum TYPE_MODAL_RELEASE_DISTRIBUTION {
    DISTRIBUTION = 'RELEASE_DISTRIBUTION',
    TAKE_DOWN = 'RELEASE_TAKE_DOWN',
    ISSUES = 'RELEASE_DISTRIBUTION_ISSUES',
}

export enum RELEASES_TABS {
    CORE_DETAIL = 'core-detail',
    TRACKS = 'tracks',
    SCHEDULE = 'schedule',
    REVIEW = 'review',
    DISTRIBUTION = 'distribution',
    SUBMITS = 'submits',
}

export enum RELEASE_VIEW_TABS {
    OVERVIEW = 'overview',
    TRACKS = 'tracks',
    ANALYTICS = 'analytics',
}

export enum RELEASES_STATUS {
    DRAFT = 'draft',
    PROCESSING = 'processing',
    AWAITING_ACTION = 'awaiting_action',
    DISTRIBUTED = 'distributed',
    PARTIALLY_FAILED = 'partially_failed',
    PARTIAL_DONE = 'partial_done',
    FAILED = 'failed',
    TAKEN_DOWN = 'taken_down',
    SUBMITTED = 'submitted',
}

export enum RELEASES_COLUMNS_DISPLAY {
    I_NO = 'iNo',
    THUMBNAIL = 'thumbnail',
    TITLE = 'title',
    ARTIST = 'artist',
    RELEASE_ID = 'releaseId',
    TYPE = 'type',
    PUBLISHER = 'publisher',
    UPC = 'upc',
    STATUS = 'status',
    TRACK_COUNT = 'tracks_count',
    DURATION = 'total_duration',
    TENANT = 'tenant',
    RELEASE_DATE = 'releaseDate',
    ACTIONS = 'actions',
    CREATED_AT = 'createdAt',
    UPDATED_AT = 'updatedAt',
}

export enum RELEASES_TABLE_KEY {
    TITLE = 'title',
    PUBLISHER = 'publisher',
    TYPE = 'type',
    UPC = 'UPC',
    STATUS = 'status',
    TRACK_COUNT = 'tracks_count',
    DURATION = 'total_duration',
    RELEASE_DATE = 'releaseDate',
    CREATED_AT = 'createdAt',
    UPDATED_AT = 'updatedAt',
    TENANT = 'tenant',
}

export enum RELEASE_TIME_MODE {
    GLOBAL_MIDNIGHT = 'global_midnight',
    SPECIFIC_TIMEZONE = 'specific_timezone',
}

export enum RELEASE_TYPE {
    VIDEO = 'video',
    AUDIO = 'audio',
}

export enum RELEASE_AI_CONTENT {
    ALL = 'ALL',
    PARTLY = 'PARTLY',
    NONE = 'NONE',
    UNDETERMINED = 'UNDETERMINED',
}

export enum RELEASE_MADE_FOR_KIDS {
    YES = 'YES',
    NO = 'NO',
    CHANNEL_DEFAULT = 'CHANNEL_DEFAULT',
}
