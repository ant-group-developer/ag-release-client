import AppToast from '@/components/app-toast';
import { authOptions } from '@/modules/auth/next-auth';
import ReactQueryProviders from '@/providers/react-query';
import SessionProvider from '@/providers/session-provider';
import '@/styles/globals.css';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import { getServerSession } from 'next-auth';
import { Inter, Open_Sans } from 'next/font/google';
import NextTopLoader from 'nextjs-toploader';
import { ReactNode } from 'react';

export const openSans = Open_Sans({
    subsets: ['latin'],
    weight: ['400', '500', '600', '700', '800'],
    variable: '--font-open-sans',
    display: 'swap',
});

export const inter = Inter({
    subsets: ['latin'],
    weight: ['400', '500', '600', '700', '800', '900'],
    variable: '--font-inter',
    display: 'swap',
    preload: true,
});

type Props = {
    children: ReactNode;
};

// Since we have a `not-found.tsx` page on the root, a layout file
// is required, even if it's just passing children through.
export default async function RootLayout({ children }: Props) {
    const session = await getServerSession(authOptions);
    return (
        <html lang="en">
            <body
                className={`${openSans.variable} ${openSans.className} ${inter.variable} ${inter.className} text-sm antialiased`}
            >
                <AntdRegistry>
                    <ReactQueryProviders>
                        <NextTopLoader showSpinner={false} />
                        <SessionProvider session={session}>
                            {children}
                            <AppToast />
                        </SessionProvider>
                    </ReactQueryProviders>
                </AntdRegistry>
            </body>
        </html>
    );
}
