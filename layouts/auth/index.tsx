'use client';

import AppLocale from '@/components/cms/app-locale';
import AppLogoWithText from '@/components/logo/app-logo-with-text';
import { useCurrentDomain } from '@/modules/tenant/hooks/use-current-domain';
import { useResolveDomain } from '@/modules/tenant/hooks/use-resolve-domain';
import { Spin, theme } from 'antd';
import { PropsWithChildren } from 'react';

export default function AuthLayout({ children }: PropsWithChildren) {
    const { token } = theme.useToken();
    const currentDomain = useCurrentDomain();
    const { domainData, isLoading, isError } = useResolveDomain(currentDomain);
    const isDomainLoading = !currentDomain || (isLoading && !isError);

    if (isDomainLoading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Spin spinning={true} />
            </div>
        );
    }
    return (
        <div
            className="flex min-h-screen flex-col items-center justify-center bg-cover bg-center px-4 py-6"
            style={{ backgroundColor: token.colorBgLayout }}
        >
            <div className="w-full max-w-[400px]">
                <div className="mb-8">
                    <AppLogoWithText
                        wrapperClassName="mx-auto"
                        size={50}
                        className="text-2xl"
                        name={domainData?.tenant?.name}
                        logo={domainData?.tenant?.logo || ''}
                    />
                </div>
                <div
                    className="rounded-2xl border p-6 shadow-xl sm:p-8 lg:p-10"
                    style={{
                        backgroundColor: token.colorBgContainer,
                        borderColor: token.colorBorder,
                    }}
                >
                    {children}
                </div>
            </div>
            {/* <SupportButton /> */}
            <div className="fixed right-10 top-10 flex items-center">
                <AppLocale buttonProps={{ type: 'text' }} />
                {/* <AppTheme buttonProps={{ type: 'text' }} /> */}
            </div>
        </div>
    );
}
