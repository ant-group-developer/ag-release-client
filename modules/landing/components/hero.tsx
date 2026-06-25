'use client';

import { APP_ROUTES } from '@/enums/routes';
import { Link } from '@/i18n/routing';
import { Button } from 'antd';
import { ArrowRight } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function Hero() {
    const t = useTranslations('landing');

    return (
        <section className="relative pb-20 pt-24 sm:pb-28 sm:pt-32">
            <div className="mx-auto max-w-7xl space-y-8 px-4 text-center sm:px-6 lg:px-8">
                {/* Badge */}
                <div className="inline-flex animate-pulse items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900 px-3 py-1 text-xs text-zinc-400 sm:text-sm">
                    <span className="flex h-2 w-2 rounded-full bg-purple-500" />
                    Professional Music Release System
                </div>

                {/* Heading */}
                <h1 className="mx-auto max-w-4xl text-4xl font-extrabold leading-[1.15] tracking-tight sm:text-6xl">
                    <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-indigo-400 bg-clip-text text-transparent">
                        {t('heroTitle')}
                    </span>
                </h1>

                {/* Subtitle */}
                <p className="mx-auto max-w-2xl text-lg font-light leading-relaxed text-zinc-400 sm:text-xl">
                    {t('heroSubtitle')}
                </p>

                {/* CTA Button */}
                <div className="flex justify-center pt-4">
                    <Link href={APP_ROUTES.SIGN_IN}>
                        <Button
                            type="primary"
                            size="large"
                            className="group flex h-14 items-center gap-2 rounded-full border-none bg-gradient-to-r from-purple-600 to-indigo-600 px-8 text-lg font-semibold shadow-xl shadow-purple-500/30 transition-all duration-300 hover:from-purple-500 hover:to-indigo-500"
                        >
                            {t('getStarted')}
                            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                        </Button>
                    </Link>
                </div>

                {/* Uptime and Distribution stats */}
                <div className="mx-auto mt-12 grid max-w-4xl grid-cols-2 gap-6 border-t border-zinc-900/80 pt-16 md:grid-cols-4">
                    <div className="space-y-1">
                        <div className="text-3xl font-extrabold text-white sm:text-4xl">
                            150+
                        </div>
                        <div className="text-xs font-medium text-zinc-500 sm:text-sm">
                            Digital Stores & DSPs
                        </div>
                    </div>
                    <div className="space-y-1">
                        <div className="text-3xl font-extrabold text-white sm:text-4xl">
                            99.9%
                        </div>
                        <div className="text-xs font-medium text-zinc-500 sm:text-sm">
                            Distribution Uptime
                        </div>
                    </div>
                    <div className="space-y-1">
                        <div className="text-3xl font-extrabold text-white sm:text-4xl">
                            1M+
                        </div>
                        <div className="text-xs font-medium text-zinc-500 sm:text-sm">
                            Tracks Distributed
                        </div>
                    </div>
                    <div className="space-y-1">
                        <div className="text-3xl font-extrabold text-white sm:text-4xl">
                            24/7
                        </div>
                        <div className="text-xs font-medium text-zinc-500 sm:text-sm">
                            Automated Support
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
