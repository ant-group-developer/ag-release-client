import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { getAccessToken } from './helpers/auth';
import { routing } from './i18n/routing';
import { auth0 } from './lib/auth0';

const PUBLIC_FILE = /\.(.*)$/;

export default createMiddleware(routing);

export async function middleware(req: NextRequest) {
    const authRes = await auth0.middleware(req);

    if (
        req.nextUrl.pathname.startsWith('/_next') ||
        PUBLIC_FILE.test(req.nextUrl.pathname)
    ) {
        return;
    }

    // authentication routes — let the middleware handle it
    if (req.nextUrl.pathname.startsWith('/auth')) {
        return authRes;
    }

    const { origin } = new URL(req.url);
    const accessToken = await getAccessToken();

    // user does not have a session — redirect to login
    if (!accessToken) {
        return NextResponse.redirect(`${origin}/auth/login`);
    }

    if (/^\/api\/(cms|account)/.test(req.nextUrl.pathname)) {
        const newResponse = NextResponse.next();
        newResponse.headers.set('Authorization', 'Bearer ' + accessToken);
        return newResponse;
    }

    return authRes;
}

export const config = {
    matcher: [
        // Skip all paths that should not be internationalized
        '/((?!_next|.*\\..*).*)',

        // Necessary for base path to work
        '/',
    ],
};
