import ReactQueryProviders from '@/providers/react-query';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import { Auth0Provider } from '@auth0/nextjs-auth0';
import { ReactNode } from 'react';

type Props = {
    children: ReactNode;
};

// Since we have a `not-found.tsx` page on the root, a layout file
// is required, even if it's just passing children through.
export default function RootLayout({ children }: Props) {
    return (
        <Auth0Provider>
            <ReactQueryProviders>
                <AntdRegistry>{children}</AntdRegistry>
            </ReactQueryProviders>
        </Auth0Provider>
    );
}
