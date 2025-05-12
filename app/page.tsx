import { COOKIES_KEY } from '@/constants/common';
import { DEFAULT_ROUTE } from '@/enums/routes';
import { redirect } from '@/i18n/routing';
import { getLocale } from 'next-intl/server';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

const LOGIN_URL = process.env.LOGIN_URL;
const REDIRECT_URI = process.env.REDIRECT_URI;
const CLIENT = process.env.CLIENT;

export default async function Home() {
    const locale = await getLocale();
    const cookieStore = await cookies();
    const value = cookieStore.get(COOKIES_KEY.TOKEN)?.value;

    if (value) {
        redirect({ href: DEFAULT_ROUTE, locale });
    } else {
        NextResponse.redirect(
            `${LOGIN_URL}?client=${CLIENT}&redirect_uri=${REDIRECT_URI}`
        );
    }
}
