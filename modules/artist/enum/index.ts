export enum TYPE_MODAL_ARTIST {
    CREATE = 'CREATE_ARTIST',
    UPDATE = 'UPDATE_ARTIST',
    DELETE = 'DELETE_ARTIST',
    DETAIL = 'DETAIL_ARTIST',

    ADD_CONTRIBUTOR = 'ADD_CONTRIBUTOR',
    LINK_PROFILE = 'LINK_PROFILE',
}

export enum ARTIST_DETAIL_TABS {
    OVERVIEW = 'overview',
    RELEASES = 'releases',
    TRACKS = 'tracks',
}

export enum ARTIST_TABLE_KEY {
    NAME = 'name',
    CODE = 'code',
    ARTIST_PROFILES = 'artistProfiles',
    COUNTRY = 'country',
    GENRE = 'genre',
    RELEASE_COUNT = 'release_count',
    TRACK_COUNT = 'track_count',
    BIOGRAPHY = 'biography',
}
