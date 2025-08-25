import GoogleAnalytics from '@/components/google-analytics';
import { defaultConfig } from '@/constants/env';
import { DEFAULT_ROUTE } from '@/enums/routes';
import { flattenData } from '@/helpers/common';
import { redirect, routing } from '@/i18n/routing';
import { adminRoutes } from '@/layouts/cms-layout/routes';
import AntdProvider from '@/providers/antd';
import type { Metadata } from 'next';
import { pathname } from 'next-extra/pathname';
import { NextIntlClientProvider } from 'next-intl';
import {
    getFormatter,
    getLocale,
    getMessages,
    getNow,
    getTimeZone,
} from 'next-intl/server';
import { Inter, Open_Sans } from 'next/font/google';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import { PropsWithChildren } from 'react';

const openSans = Open_Sans({
    subsets: ['latin'],
    weight: ['400', '500', '600', '700', '800'],
    variable: '--font-open-sans',
    display: 'swap',
});

const inter = Inter({
    subsets: ['latin'],
    weight: ['400', '500', '600', '700', '800', '900'],
    variable: '--font-inter',
    display: 'swap',
    preload: true,
});

interface RootLayoutProps extends PropsWithChildren {
    params: Promise<{ locale: string }>;
}

export async function generateMetadata({
    params,
}: Omit<RootLayoutProps, 'children'>): Promise<Metadata> {
    const { locale } = await params;
    const formatter = await getFormatter({ locale });
    const now = await getNow({ locale });
    const timeZone = await getTimeZone({ locale });
    const route = await pathname();

    // const settingData = await getCurrentTenant(cookies()?.toString?.());
    const settingData = null as any;

    const getTitle = () => {
        const flattenRoutes = flattenData(adminRoutes, {});
        const result = flattenRoutes.find(
            (item) => `/${locale}${item.href}` === route
        );
        return result?.title ?? defaultConfig.SLOGAN;
    };
    const title = getTitle();

    const appTitle = title
        ? `${settingData?.name ?? defaultConfig.APP_SHORT_NAME} | ${title}`
        : (settingData?.name ?? defaultConfig.APP_SHORT_NAME);
    const appDescription = settingData?.title || defaultConfig.APP_DESCRIPTION;
    const appUrl =
        (settingData?.domain && `https://${settingData.domain}`) ||
        defaultConfig.WEBSITE_URL ||
        '';
    const appImage = defaultConfig.APP_IMAGE;
    const appKeyword = defaultConfig.APP_KEYWORDS;
    const appIcon =
        settingData?.icon || settingData?.logo || defaultConfig.APP_LOGO;

    return {
        metadataBase: new URL(appUrl),
        title: appTitle,
        description: appDescription,
        openGraph: {
            url: appUrl,
            title: appTitle,
            description: appDescription,
            images: appImage,
        },
        other: {
            currentYear: formatter.dateTime(now, { year: 'numeric' }),
            timeZone: timeZone || 'N/A',
        },
        icons: appIcon,
        twitter: {
            card: 'summary_large_image',
            site: appUrl,
            title: appTitle,
            description: appDescription,
            images: appImage,
        },
        keywords: appKeyword,
    };
}

export default async function RootLayout({
    children,
    params,
}: Readonly<RootLayoutProps>) {
    const { locale } = await params;
    // Ensure that the incoming `locale` is valid
    if (!routing.locales.includes(locale as any)) {
        const defaultLocale = await getLocale();
        redirect({ href: DEFAULT_ROUTE, locale: defaultLocale });
    }
    const messages = await getMessages({ locale });

    return (
        <html lang={locale}>
            <body
                className={`${openSans.variable} ${openSans.className} ${inter.variable} ${inter.className} text-sm antialiased`}
            >
                <NextIntlClientProvider locale={locale} messages={messages}>
                    {/* <ThemeProvider /> */}
                    <AntdProvider>
                        <NuqsAdapter>{children}</NuqsAdapter>
                        <GoogleAnalytics />
                    </AntdProvider>
                </NextIntlClientProvider>
            </body>
        </html>
    );
}
