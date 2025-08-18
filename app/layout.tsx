import AppToast from '@/components/app-toast';
import { authOptions } from '@/modules/auth/next-auth';
import ReactQueryProviders from '@/providers/react-query';
import SessionProvider from '@/providers/session-provider';
import '@/styles/globals.css';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import { getServerSession } from 'next-auth';
import NextTopLoader from 'nextjs-toploader';
import { ReactNode } from 'react';

type Props = {
    children: ReactNode;
};

// Since we have a `not-found.tsx` page on the root, a layout file
// is required, even if it's just passing children through.
export default async function RootLayout({ children }: Props) {
    const session = await getServerSession(authOptions);
    return (
        <AntdRegistry>
            <ReactQueryProviders>
                <NextTopLoader showSpinner={false} />
                <SessionProvider session={session}>
                    {children}
                    <AppToast />
                </SessionProvider>
            </ReactQueryProviders>
        </AntdRegistry>
    );
}
