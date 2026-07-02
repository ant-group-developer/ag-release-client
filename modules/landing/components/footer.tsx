'use client';

import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { useGetSettingPublic } from '@/modules/setting/hooks/use-get-setting-public';
import Image from 'next/image';

interface FooterProps {
    onChangeTab?: (tab: 'home' | 'news' | 'docs') => void;
}

export default function Footer({ onChangeTab }: FooterProps) {
    const message = useTranslations('landing');
    const { settingConfig } = useGetSettingPublic();
    const websiteName = settingConfig?.website?.name || 'ANT Group';
    const websiteLogo = settingConfig?.website?.logo || '/logo.png';

    const handleLinkClick = (tabId: 'home' | 'news' | 'docs') => {
        if (onChangeTab) {
            onChangeTab(tabId);
        } else {
            window.location.hash = `#${tabId}`;
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    return (
        <footer className="relative z-10 border-t border-zinc-900 bg-zinc-950 py-12 text-xs text-zinc-500 sm:text-sm">
            <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-4 sm:px-6 lg:px-8 md:flex-row">
                <div
                    className="flex cursor-pointer items-center gap-3 text-zinc-400 transition-opacity hover:opacity-90"
                    onClick={() => handleLinkClick('home')}
                >
                    <Image
                        src={websiteLogo}
                        alt={`${websiteName} Logo`}
                        width={24}
                        height={24}
                        className="opacity-80 object-contain"
                    />
                    <span>&copy; {new Date().getFullYear()} {websiteName}. All rights reserved.</span>
                </div>
                <div className="flex items-center gap-6 text-zinc-300">
                    <button
                        onClick={() => handleLinkClick('home')}
                        className="transition-colors hover:text-white"
                    >
                        {message('navHome')}
                    </button>
                    <button
                        onClick={() => handleLinkClick('news')}
                        className="transition-colors hover:text-white"
                    >
                        {message('navNews')}
                    </button>
                    <button
                        onClick={() => handleLinkClick('docs')}
                        className="transition-colors hover:text-white"
                    >
                        {message('navDocs')}
                    </button>
                </div>
            </div>
        </footer>
    );
}

