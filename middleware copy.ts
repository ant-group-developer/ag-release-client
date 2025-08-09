import { withMiddlewareAuthRequired } from '@auth0/nextjs-auth0/edge';
import { NextRequest, NextResponse } from 'next/server';
import { getAccessToken } from './helpers/auth';

export default withMiddlewareAuthRequired(async function middleware(
    req: NextRequest
) {
    // Create response object
    const response = NextResponse.next();

    if (/^\/api\/(v1|v2)/.test(req.nextUrl.pathname)) {
        const accessToken = await getAccessToken(req);
        if (accessToken) {
            response.headers.set('Authorization', 'Bearer ' + accessToken);
        }
    }

    return response;
});

// Define paths that should be excluded from authentication requirements
export const config = {
    matcher: [
        // Apply middleware to all paths except auth-related paths
        '/((?!api/auth).*)',
    ],
};
