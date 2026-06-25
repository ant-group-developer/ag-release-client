'use client';

import { APP_ROUTES } from '@/enums/routes';
import { Link } from '@/i18n/routing';
import { Button } from 'antd';
import { ArrowRight } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { useGetSettingPublic } from '@/modules/setting/hooks/use-get-setting-public';

export default function CTABanner() {
    const t = useTranslations('landing');
    const { settingConfig } = useGetSettingPublic();
    const websiteName = settingConfig?.website?.name || 'ANT Group';

    return (
        <section className="relative border-zinc-900 bg-zinc-950/20 py-20">
            <div className="pointer-events-none absolute left-1/2 top-1/2 z-0 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-600/15 blur-[130px]" />
            <div className="pointer-events-none absolute left-1/2 top-1/2 z-0 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-600/10 blur-[140px]" />

            <div className="relative z-10 mx-auto max-w-5xl space-y-8 px-4 text-center sm:px-6 lg:px-8">
                <h2 className="mx-auto max-w-3xl text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl">
                    <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent">
                        {t('ctaTitle')}
                    </span>
                </h2>
                <p className="mx-auto max-w-xl text-sm font-light leading-relaxed text-zinc-400 sm:text-base">
                    {t('ctaSubtitle', { appName: websiteName })}
                </p>

                <div className="flex justify-center pt-4">
                    <Link href={APP_ROUTES.SIGN_IN}>
                        <Button
                            type="primary"
                            size="large"
                            className="group flex h-14 items-center gap-2 rounded-full border-none bg-gradient-to-r from-purple-600 to-indigo-600 px-8 text-base font-semibold shadow-xl shadow-purple-500/30 transition-all duration-300 hover:from-purple-500 hover:to-indigo-500 sm:text-lg"
                        >
                            {t('ctaButton')}
                            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    );
}
