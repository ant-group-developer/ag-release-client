import { COOKIES_KEY } from '@/constants/common';
import { APP_ROUTES, DEFAULT_ROUTE } from '@/enums/routes';
import {
    AccessTokenPayload,
    RefreshTokenPayload,
} from '@/modules/auth/types/token';
import { jwtDecode } from 'jwt-decode';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const accessToken = searchParams.get('accessToken');
    const refreshToken = searchParams.get('refreshToken');
    try {
        if (accessToken && refreshToken) {
            const accessTokenPayload =
                jwtDecode<AccessTokenPayload>(accessToken);
            const refreshTokenPayload =
                jwtDecode<RefreshTokenPayload>(refreshToken);

            const secure = process.env.NODE_ENV === 'production';

            const response = NextResponse.redirect(
                new URL(DEFAULT_ROUTE, process.env.REDIRECT_URI || request.url)
            );

            response.cookies.set(COOKIES_KEY.TOKEN, accessToken, {
                httpOnly: true,
                sameSite: 'lax',
                expires: new Date(accessTokenPayload.exp * 1000),
                secure,
            });
            response.cookies.set(COOKIES_KEY.REFRESH_TOKEN, refreshToken, {
                httpOnly: true,
                sameSite: 'lax',
                expires: new Date(refreshTokenPayload.exp * 1000),
                secure,
            });

            return response;
        } else {
            return NextResponse.redirect(APP_ROUTES.LOGIN);
        }
    } catch (error) {
        console.log('error:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
