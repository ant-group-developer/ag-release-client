'use client';

import AppLocale from '@/components/cms/app-locale';
import AppLogoWithText from '@/components/logo/app-logo-with-text';
import { useCustomDomainStore } from '@/hooks/use-custom-domain-store';
import { Image, theme } from 'antd';
import { PropsWithChildren } from 'react';

export default function AuthLayout({ children }: PropsWithChildren) {
    const { token } = theme.useToken();
    const { isPrimaryDomain, tenant } = useCustomDomainStore();

    const isCustomDomain = isPrimaryDomain === false && tenant;

    return (
        <div
            className="flex min-h-screen flex-col items-center justify-center bg-cover bg-center px-4 py-6"
            style={{ backgroundColor: token.colorBgLayout }}
        >
            <div className="w-full max-w-[400px]">
                <div className="mb-8 flex flex-col items-center gap-2">
                    {isCustomDomain ? (
                        <>
                            {tenant.logo && (
                                <Image
                                    src={tenant.logo}
                                    alt={tenant.name}
                                    height={50}
                                    width={50}
                                    preview={false}
                                    style={{ objectFit: 'contain' }}
                                />
                            )}
                            <h2 className="text-center text-2xl font-extrabold tracking-wide">
                                {tenant.title || tenant.name}
                            </h2>
                        </>
                    ) : (
                        <AppLogoWithText
                            wrapperClassName="mx-auto"
                            size={50}
                            className="text-2xl"
                        />
                    )}
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
            <div className="fixed right-10 top-10 flex items-center">
                <AppLocale buttonProps={{ type: 'text' }} />
            </div>
        </div>
    );
}
