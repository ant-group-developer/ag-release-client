import { COOKIES_KEY } from '@/constants/common';
import { APP_ROUTES } from '@/enums/routes';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    // Tạo URL tuyệt đối dựa trên request hiện tại
    const redirectUrl = new URL(
        APP_ROUTES.LOGIN,
        process.env.REDIRECT_URI || request.url
    );

    // Tạo response redirect
    const response = NextResponse.redirect(redirectUrl);

    // Xoá cookie bằng cách sử dụng phương thức delete
    response.cookies.delete(COOKIES_KEY.TOKEN);
    response.cookies.delete(COOKIES_KEY.REFRESH_TOKEN);

    return response;
}
