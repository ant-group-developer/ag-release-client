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
}

export enum TYPE_MODAL_TRACK {
    ADD = 'ADD',
    DELETE = 'DELETE',
    BULK_DELETE = 'BULK_DELETE',
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

export enum TYPE_MODAL_RELEASE_DISTRIBUTION {
    DISTRIBUTION = 'RELEASE_DISTRIBUTION',
    TAKE_DOWN = 'RELEASE_TAKE_DOWN',
}

export enum RELEASES_TABS {
    CORE_DETAIL = 'core-detail',
    TRACKS = 'tracks',
    SCHEDULE = 'schedule',
    REVIEW = 'review',
    DISTRIBUTION = 'distribution',
}

export enum RELEASES_STATUS {
    DRAFT = 'draft',
    PROCESSING = 'processing',
    ISSUES = 'issues',
    NEVER_DISTRIBUTED = 'never_distributed',
    DISTRIBUTED = 'distributed',
    TAKEN_DOWN = 'taken_down',
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

export enum RELEASE_TIME_MODE {
    GLOBAL_MIDNIGHT = 'global_midnight',
    SPECIFIC_TIMEZONE = 'specific_timezone',
}
