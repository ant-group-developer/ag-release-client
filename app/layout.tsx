import { authOptions } from '@/modules/auth/next-auth';
import ReactQueryProviders from '@/providers/react-query';
import SessionProvider from '@/providers/session-provider';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import { getServerSession } from 'next-auth';
import { ReactNode } from 'react';

type Props = {
    children: ReactNode;
};

// Since we have a `not-found.tsx` page on the root, a layout file
// is required, even if it's just passing children through.
export default async function RootLayout({ children }: Props) {
    const session = await getServerSession(authOptions);
    return (
        <ReactQueryProviders>
            <AntdRegistry>
                <SessionProvider session={session}>{children}</SessionProvider>
            </AntdRegistry>
        </ReactQueryProviders>
    );
}
