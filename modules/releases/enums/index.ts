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
    TRACK_COUNT = 'trackCount',
    DURATION = 'duration',
    RELEASE_DATE = 'releaseDate',
    CREATION_DATE = 'creationDate',
    ACTIONS = 'actions',
}
