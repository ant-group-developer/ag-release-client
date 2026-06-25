'use client';

import { useTranslations } from 'next-intl';
import { UserPlus, ShieldCheck, Globe, Coins } from 'lucide-react';

export default function HowItWorks() {
    const t = useTranslations('landing');

    const steps = [
        {
            icon: <UserPlus className="w-6 h-6" />,
            title: t('step1Title'),
            desc: t('step1Desc'),
            glow: 'group-hover:text-purple-400',
            bgGlow: 'bg-purple-500/10 text-purple-400',
        },
        {
            icon: <ShieldCheck className="w-6 h-6" />,
            title: t('step2Title'),
            desc: t('step2Desc'),
            glow: 'group-hover:text-blue-400',
            bgGlow: 'bg-blue-500/10 text-blue-400',
        },
        {
            icon: <Globe className="w-6 h-6" />,
            title: t('step3Title'),
            desc: t('step3Desc'),
            glow: 'group-hover:text-indigo-400',
            bgGlow: 'bg-indigo-500/10 text-indigo-400',
        },
        {
            icon: <Coins className="w-6 h-6" />,
            title: t('step4Title'),
            desc: t('step4Desc'),
            glow: 'group-hover:text-pink-400',
            bgGlow: 'bg-pink-500/10 text-pink-400',
        },
    ];

    return (
        <section className="py-20 bg-zinc-950/20 border-t border-zinc-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
                <div className="text-center space-y-4">
                    <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
                        {t('howItWorksTitle')}
                    </h2>
                    <p className="text-zinc-400 max-w-xl mx-auto text-sm sm:text-base font-light">
                        {t('howItWorksSubtitle')}
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative">
                    {steps.map((step, idx) => (
                        <div
                            key={idx}
                            className="group bg-zinc-900/20 hover:bg-zinc-900/40 border border-zinc-900/60 hover:border-zinc-800 p-6 rounded-2xl transition-all duration-300 relative flex flex-col justify-between"
                        >
                            <div>
                                <div className={`w-12 h-12 rounded-xl ${step.bgGlow} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                                    {step.icon}
                                </div>
                                <h3 className={`text-base sm:text-lg font-bold text-white mb-3 transition-colors ${step.glow}`}>
                                    {step.title}
                                </h3>
                                <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">
                                    {step.desc}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
