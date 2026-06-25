'use client';

import { APP_ROUTES } from '@/enums/routes';
import { Link } from '@/i18n/routing';
import { Button } from 'antd';
import { ArrowRight } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { useGetSettingPublic } from '@/modules/setting/hooks/use-get-setting-public';

const HERO_STATS = [
    { value: '150+', labelKey: 'landing.digitalStores' },
    { value: '99.9%', labelKey: 'landing.distributionUptime' },
    { value: '1M+', labelKey: 'landing.tracksDistributed' },
    { value: '24/7', labelKey: 'landing.automatedSupport' },
] as const;

export default function Hero() {
    const message = useTranslations();
    const { settingConfig } = useGetSettingPublic();
    const websiteName = settingConfig?.website?.name || 'ANT Group';

    return (
        <section className="relative flex min-h-[calc(100vh-64px)] flex-col justify-center overflow-hidden py-12 sm:py-20">
            {/* Background Video */}
            <div className="absolute inset-0 z-0 h-full w-full overflow-hidden">
                <video
                    src="/video/landing-video.mp4"
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="h-full w-full object-cover opacity-45"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/90 via-transparent to-zinc-950" />
            </div>

            <div className="relative z-10 mx-auto max-w-7xl space-y-8 px-4 text-center sm:px-6 lg:px-8">
                {/* Heading */}
                <h1 className="mx-auto max-w-4xl text-4xl font-extrabold leading-[1.15] tracking-tight sm:text-6xl">
                    <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-indigo-400 bg-clip-text text-transparent">
                        {message('landing.heroTitle')}
                    </span>
                </h1>

                {/* Subtitle */}
                <p className="mx-auto max-w-2xl text-lg font-light leading-relaxed text-zinc-400 sm:text-xl">
                    {message('landing.heroSubtitle', { appName: websiteName })}
                </p>

                {/* CTA Button */}
                <div className="flex justify-center pt-4">
                    <Link href={APP_ROUTES.SIGN_IN}>
                        <Button
                            type="primary"
                            size="large"
                            className="group flex h-14 items-center gap-2 rounded-full border-none bg-gradient-to-r from-purple-600 to-indigo-600 px-8 text-lg font-semibold shadow-xl shadow-purple-500/30 transition-all duration-300 hover:from-purple-500 hover:to-indigo-500"
                        >
                            {message('landing.getStarted')}
                            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                        </Button>
                    </Link>
                </div>

                {/* Uptime and Distribution stats */}
                <div className="mx-auto mt-12 grid max-w-4xl grid-cols-2 gap-6 border-zinc-900/80 pt-16 md:grid-cols-4">
                    {HERO_STATS.map((stat, index) => (
                        <div key={index} className="space-y-1">
                            <div className="text-3xl font-extrabold text-white sm:text-4xl">
                                {stat.value}
                            </div>
                            <div className="text-xs font-medium text-zinc-500 sm:text-sm">
                                {message(stat.labelKey)}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
