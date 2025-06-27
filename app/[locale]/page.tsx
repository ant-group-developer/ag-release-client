import { DEFAULT_ROUTE } from '@/enums/routes';
import { redirect } from '@/i18n/routing';
import { getLocale } from 'next-intl/server';

export default async function Home() {
    const locale = await getLocale();
    // const accessToken = await getAccessToken();
    // if (accessToken) {
    redirect({ href: DEFAULT_ROUTE, locale });
    // }
}
