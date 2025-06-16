import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { COOKIES_KEY } from './constants/common';
import { defaultConfig } from './constants/env';
import { APP_ROUTES, DEFAULT_ROUTE } from './enums/routes';
import { routing } from './i18n/routing';

const PUBLIC_FILE = /\.(.*)$/;
const LOGIN_URL = defaultConfig.LOGIN_URL;
const REDIRECT_URI = defaultConfig.REDIRECT_URI;
const CLIENT = defaultConfig.CLIENT;

export default createMiddleware(routing);

export async function middleware(req: NextRequest) {
    if (
        req.nextUrl.pathname.startsWith('/_next') ||
        PUBLIC_FILE.test(req.nextUrl.pathname)
    ) {
        return;
    }

    if (/^\/api/.test(req.nextUrl.pathname)) {
        // if sending a request to /api/...
        const newResponse = NextResponse.next(); // prepare a new response

        // modify your response if needed
        const bearerToken = req.cookies.get(COOKIES_KEY.TOKEN)?.value;
        newResponse.headers.set('Authorization', 'Bearer ' + bearerToken);
        // ...

        return newResponse; // return the modified response
    }

    const cookieToken = req.cookies.get(COOKIES_KEY.TOKEN)?.value;
    // const cookieLocale =
    //     req.cookies.get(COOKIES_KEY.LOCALE)?.value ?? DEFAULT_LOCALE;

    if (cookieToken && APP_ROUTES.LOGIN === req.nextUrl.pathname) {
        const url = req.nextUrl.clone();
        url.pathname = DEFAULT_ROUTE;
        return NextResponse.redirect(url);
    }

    // if (!cookieToken && !PUBLIC_ROUTES.includes(req.nextUrl.pathname as any)) {
    //     return NextResponse.redirect(
    //         `${LOGIN_URL}?client=${CLIENT}&redirect_uri=${REDIRECT_URI}`
    //     );
    // return NextResponse.redirect(
    //     `${LOGIN_URL}/${cookieLocale}?client=${CLIENT}&redirect_uri=${REDIRECT_URI}`
    // );
    // }

    // if (cookieLocale && req.nextUrl.locale !== cookieLocale) {
    //     const newURL = `/${cookieLocale}${req.nextUrl.pathname}${req.nextUrl.search}`;
    //     return NextResponse.redirect(new URL(newURL, req.url));
    // }
}

export const config = {
    matcher: [
        // Skip all paths that should not be internationalized
        '/((?!_next|.*\\..*).*)',

        // Necessary for base path to work
        '/',
    ],
};
