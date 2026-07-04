'use client';

import AppLocale from '@/components/cms/app-locale';
import { APP_ROUTES } from '@/enums/routes';
import { Link, useRouter } from '@/i18n/routing';
import { Button } from 'antd';
import { useTranslations } from 'next-intl';
import { useGetSettingPublic } from '@/modules/setting/hooks/use-get-setting-public';
import Image from 'next/image';

type HeaderProps = {
    activeTab?: 'home' | 'news' | 'docs';
    onChangeTab?: (tab: 'home' | 'news' | 'docs') => void;
};

export default function Header({ activeTab, onChangeTab }: HeaderProps) {
    const tAuth = useTranslations('auth');
    const message = useTranslations('landing');
    const router = useRouter();
    const { settingConfig } = useGetSettingPublic();
    const websiteName = settingConfig?.website?.name || 'ANT Group';
    const websiteLogo = settingConfig?.website?.logo || '/logo.png';

    const handleNavClick = (tabId: 'home' | 'news' | 'docs') => {
        if (onChangeTab) {
            onChangeTab(tabId);
        } else {
            router.push(`/landing#${tabId}`);
        }
    };

    return (
        <header className="sticky top-0 z-50 border-b border-zinc-900 bg-zinc-950/70 backdrop-blur-md">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                {/* Logo Section */}
                <div
                    className="flex cursor-pointer items-center gap-3 transition-opacity hover:opacity-90"
                    onClick={() => handleNavClick('home')}
                >
                    <Image
                        src={websiteLogo}
                        alt={`${websiteName} Logo`}
                        width={36}
                        height={36}
                        className="rounded-lg bg-zinc-900 object-contain p-1"
                    />
                    <span className="bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-xl font-bold tracking-tight text-transparent">
                        {websiteName}
                    </span>
                </div>

                {/* Navigation Menu (Capsule Style, centered with active/hover underline) */}
                <nav className="hidden items-center gap-8 md:flex">
                    {[
                        { id: 'news', label: message('navNews') },
                        { id: 'docs', label: message('navDocs') },
                    ].map((item) => {
                        const isActive = activeTab === item.id;
                        return (
                            <button
                                key={item.id}
                                onClick={() => handleNavClick(item.id as any)}
                                className={`group relative py-1.5 text-sm transition-colors duration-200 ${
                                    isActive
                                        ? 'font-semibold text-white'
                                        : 'font-medium text-zinc-400 hover:text-white'
                                }`}
                            >
                                {item.label}
                                <span
                                    className={`absolute bottom-0 left-0 h-[2px] w-full origin-center bg-blue-500 transition-transform duration-300 ${
                                        isActive
                                            ? 'scale-x-100'
                                            : 'scale-x-0 group-hover:scale-x-100'
                                    }`}
                                />
                            </button>
                        );
                    })}
                </nav>

                {/* CTA Action Section */}
                <div className="flex items-center gap-4">
                    <AppLocale
                        buttonProps={{
                            type: 'text',
                            className: 'flex h-10 items-center justify-center rounded-full border border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800 px-4 text-zinc-300 hover:text-white transition-colors cursor-pointer !flex !items-center !gap-2',
                        }}
                    />
                    <Link href={APP_ROUTES.SIGN_IN}>
                        <Button
                            type="primary"
                            size="large"
                            className="flex h-10 items-center rounded-full border-none bg-gradient-to-r from-purple-600 to-indigo-600 px-6 font-semibold shadow-lg shadow-purple-500/20 hover:from-purple-500 hover:to-indigo-500"
                        >
                            {tAuth('signIn.submit') || 'Đăng nhập'}
                        </Button>
                    </Link>
                </div>
            </div>
        </header>
    );
}
