import { LOCALE } from '@/enums/common';
import { createNavigation } from 'next-intl/navigation';
import { defineRouting } from 'next-intl/routing';

export const defaultLocale = LOCALE.EN;

export const routing = defineRouting({
    // locales: ['en', 'vi'],
    // defaultLocale: 'vi',
    locales: Object.values(LOCALE),
    defaultLocale,
    localeCookie:
        process.env.NEXT_PUBLIC_USE_CASE === 'locale-cookie-false'
            ? false
            : {
                  // 200 days
                  maxAge: 200 * 24 * 60 * 60,
              },
});

// export type Pathnames = keyof typeof routing.pathnames;
export type Locale = (typeof routing.locales)[number];

export const { Link, getPathname, redirect, usePathname, useRouter } =
    createNavigation(routing);
