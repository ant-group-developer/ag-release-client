export enum TRACKS_COLUMNS_DISPLAY {
    I_NO = 'iNo',
    THUMBNAIL = 'thumbnail',
    ID = 'id',
    TITLE = 'title',
    GENRES = 'genres',
    TRACK_ARTIST = 'trackArtists',
    ISRC = 'isrc',
    DURATION = 'duration',
    VERSION = 'version',
    ACTIONS = 'actions',
    ACR_CLOUD = 'acrCloud',
    CREATED_AT = 'createdAt',
}

export enum TYPE_MODAL_TRACK_ARTIST {
    ADD = 'add',
    UPDATE = 'update',
    DELETE = 'delete',
}

export enum GENRES {
    POP = 'pop',
    ROCK = 'rock',
    JAZZ = 'jazz',
    HIP_HOP = 'hip hop',
    CLASSICAL = 'classical',
    ELECTRONIC = 'electronic',
    RAP = 'rap',
    COUNTRY = 'country',
    REGGAE = 'reggae',
    BLUES = 'blues',
    R_B = 'r&b',
}

export enum TRACK_TABS {
    METADATA = 'metadata',
    AUDIO_FILE = 'audio-file',
}

export enum SCAN_COPYRIGHT_STATUS {
    UN_SCANNED = 'un_scanned',
    FINISHED = 'finished',
    WARNING = 'warning',
    REJECTED = 'rejected',
}
