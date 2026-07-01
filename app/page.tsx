import { DEFAULT_ROUTE, APP_ROUTES } from '@/enums/routes';
import { redirect } from '@/i18n/routing';
import { getLocale } from 'next-intl/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/modules/auth/next-auth';

export default async function Home() {
    const locale = await getLocale();
    const session = await getServerSession(authOptions);

    if (session) {
        redirect({ href: DEFAULT_ROUTE, locale });
    } else {
        redirect({ href: APP_ROUTES.HOME, locale });
    }
}
