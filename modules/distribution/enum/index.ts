export enum DISTRIBUTION_COLUMNS_DISPLAY {
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
    ACTIONS = 'actions',
}

export enum DISTRIBUTION_STATUS {
    ALL = 'all',
    PROGRESS = 'progress',
    ISSUE = 'issue',
    DISTRIBUTED = 'distributed',
    TAKE_DOWN = 'takeDown',
    NEVER_DISTRIBUTED = 'never_distributed',
}

export enum RELEASE_DSP_DELIVERY_STATUS {
    DRAFT = 'draft',
    PROCESSING = 'processing',
    ISSUES = 'issues',
    NEVER_DISTRIBUTED = 'never_distributed',
    DISTRIBUTED = 'distributed',
    TAKEN_DOWN = 'taken_down',
}

export enum TYPE_MODAL_DISTRIBUTION {
    DETAIL = 'DETAIL_DISTRIBUTION',
}
