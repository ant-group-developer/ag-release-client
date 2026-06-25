'use client';

import { APP_ROUTES } from '@/enums/routes';
import { Link } from '@/i18n/routing';
import { Button } from 'antd';
import { ArrowRight } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function CTABanner() {
    const t = useTranslations('landing');

    return (
        <section className="py-20 bg-zinc-950/20 border-t border-zinc-900 relative overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-3xl -z-10 pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/5 rounded-full blur-3xl -z-10 pointer-events-none" />

            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8 relative">
                <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight max-w-3xl mx-auto leading-tight">
                    <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent">
                        {t('ctaTitle')}
                    </span>
                </h2>
                <p className="text-zinc-400 max-w-xl mx-auto text-sm sm:text-base font-light leading-relaxed">
                    {t('ctaSubtitle')}
                </p>

                <div className="pt-4 flex justify-center">
                    <Link href={APP_ROUTES.SIGN_IN}>
                        <Button
                            type="primary"
                            size="large"
                            className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 border-none rounded-full h-14 px-8 font-semibold text-base sm:text-lg flex items-center gap-2 shadow-xl shadow-purple-500/30 group transition-all duration-300"
                        >
                            {t('ctaButton')}
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    );
}
