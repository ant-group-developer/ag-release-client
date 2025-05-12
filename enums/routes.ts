export enum APP_ROUTES {
    FORBIDDEN = '/forbidden',
    LOGIN = '/login',
    HOME = '/',
    NOT_FOUND = '/404',
    SERVER_ERROR = '/500',
    LOG = '/log',
    UPLOAD = '/upload',
    PERMISSION = '/permission',
    BLANK = '/blank',
    USER = '/user',
}

export const AUTH_ROUTES: string[] = [APP_ROUTES.LOGIN];

export const DEFAULT_ROUTE = APP_ROUTES.BLANK;

export const HOME_ROUTE = APP_ROUTES.BLANK;

export const PUBLIC_ROUTES = [APP_ROUTES.NOT_FOUND, APP_ROUTES.SERVER_ERROR];
