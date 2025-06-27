export enum APP_ROUTES {
    FORBIDDEN = '/forbidden',
    LOGIN = '/login',
    NOT_FOUND = '/404',
    SERVER_ERROR = '/500',
    LOG = '/log',
    UPLOAD = '/upload',
    PERMISSION = '/permission',
    USER = '/user',
    HOME = '/',
    DASHBOARD = '/dashboard',
    RELEASES = '/releases',
    TRACKS = '/tracks',
    CREATE_RELEASE = '/release-detail',
    LABELS = '/labels',
    ARTISTS = '/artists',
    DISTRIBUTION = '/distribution',
    LANGUAGES = '/languages',
    COUNTRIES = '/countries',
    GENRES = '/genres',
    DSP = '/dsp',
    ARTIST_ROLE = '/artist-role',
    EMAIL_SENDER = '/email-sender',
}

export const AUTH_ROUTES: string[] = [APP_ROUTES.LOGIN];

export const DEFAULT_ROUTE = APP_ROUTES.DASHBOARD;

export const HOME_ROUTE = APP_ROUTES.DASHBOARD;

export const PUBLIC_ROUTES = [APP_ROUTES.NOT_FOUND, APP_ROUTES.SERVER_ERROR];
