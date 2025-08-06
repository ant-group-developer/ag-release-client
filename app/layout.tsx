import ReactQueryProviders from '@/providers/react-query';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import { UserProvider } from '@auth0/nextjs-auth0/client';
import { ReactNode } from 'react';

type Props = {
    children: ReactNode;
};

// Since we have a `not-found.tsx` page on the root, a layout file
// is required, even if it's just passing children through.
export default function RootLayout({ children }: Props) {
    return (
        <UserProvider>
            <ReactQueryProviders>
                <AntdRegistry>{children}</AntdRegistry>
            </ReactQueryProviders>
        </UserProvider>
    );
}
