import GoogleAnalytics from '@/components/google-analytics';
import ThemeProvider from '@/components/theme-provider';
import { defaultConfig } from '@/constants/env';
import { DEFAULT_ROUTE } from '@/enums/routes';
import { flattenData } from '@/helpers/common';
import { redirect, routing } from '@/i18n/routing';
import { adminRoutes } from '@/layouts/cms-layout/routes';
import AntdProvider from '@/providers/antd';
import '@/styles/globals.css';
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
import localFont from 'next/font/local';
import { cookies } from 'next/headers';
import NextTopLoader from 'nextjs-toploader';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import { PropsWithChildren } from 'react';
import { ToastContainer } from 'react-toastify';

const openSans = Open_Sans({
    subsets: ['latin'],
    variable: '--font-open-sans',
    display: 'swap',
});

const boston = localFont({
    src: '../fonts/boston.otf',
    variable: '--font-boston',
});

const inter = Inter({ subsets: ['latin'] });

interface RootLayoutProps extends PropsWithChildren {
    params: Promise<{ locale: string }>;
}

async function fetchSiteSettings() {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('at')?.value;

    try {
        const baseUrl = process.env.API_URL;
        const response = await fetch(`${baseUrl}/config/public-config`, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`,
            },
        });

        if (!response.ok) {
            throw new Error(`Error fetching settings: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Failed to fetch site settings:', error);
        return { data: null };
    }
}

export async function generateMetadata({
    params,
}: Omit<RootLayoutProps, 'children'>): Promise<Metadata> {
    const { locale } = await params;
    const formatter = await getFormatter({ locale });
    const now = await getNow({ locale });
    const timeZone = await getTimeZone({ locale });
    const route = await pathname();
    // const { data } = await useGetSettingPublic();
    // let settingData;
    // try {
    //     const response = await settingApi.getSettingPublic();
    //     settingData = response?.data?.data;
    // } catch (error) {
    //     console.error('Failed to fetch settings:', error);
    // }

    const settingsResponse = await fetchSiteSettings();
    const settingData = settingsResponse.data;

    const getTitle = () => {
        const flattenRoutes = flattenData(adminRoutes, {});
        const result = flattenRoutes.find(
            (item) => `/${locale}${item.href}` === route
        );
        return result?.title ?? defaultConfig.SLOGAN;
    };
    const title = getTitle();

    const appTitle = title
        ? `${settingData?.website ?? defaultConfig.APP_SHORT_NAME} | ${title}`
        : (settingData?.website ?? defaultConfig.APP_SHORT_NAME);
    const appDescription = defaultConfig.APP_DESCRIPTION;
    const appUrl = defaultConfig.WEBSITE_URL;
    const appImage = defaultConfig.APP_IMAGE;
    const appKeyword = defaultConfig.APP_KEYWORDS;

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
        icons: '/logo.png',
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
        <html lang={locale} suppressHydrationWarning>
            <body
                className={`${boston.variable} ${openSans.variable} ${openSans.className} ${inter.className} text-sm antialiased`}
            >
                <GoogleAnalytics />
                <NextIntlClientProvider locale={locale} messages={messages}>
                    <ThemeProvider />
                    <AntdProvider>
                        <NuqsAdapter>{children}</NuqsAdapter>
                    </AntdProvider>
                </NextIntlClientProvider>
                <ToastContainer
                    pauseOnFocusLoss={false}
                    position="top-center"
                />
                {/* <ProgressBar /> */}
                <NextTopLoader showSpinner={false} />
            </body>
        </html>
    );
}
