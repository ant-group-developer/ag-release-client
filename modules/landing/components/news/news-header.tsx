'use client';

import { useTranslations } from 'next-intl';

import { useGetSettingPublic } from '@/modules/setting/hooks/use-get-setting-public';

export default function NewsHeader() {
    const t = useTranslations('landing');
    const { settingConfig } = useGetSettingPublic();
    const websiteName = settingConfig?.website?.name || 'ANT Group';

    return (
        <div className="space-y-4 text-center">
            <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-5xl">
                {t('newsTitle')}
            </h1>
            <p className="mx-auto max-w-xl text-sm font-light text-zinc-400 sm:text-base">
                {t('newsSubtitle', { appName: websiteName })}
            </p>
        </div>
    );
}
