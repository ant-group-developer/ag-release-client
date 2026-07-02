'use client';

import { useTranslations } from 'next-intl';
import { UserPlus, ShieldCheck, Globe, Coins } from 'lucide-react';

export default function HowItWorks() {
    const t = useTranslations('landing');

    const steps = [
        {
            num: '01',
            icon: <UserPlus className="w-5 h-5" />,
            title: t('step1Title'),
            desc: t('step1Desc'),
            color: 'from-purple-500 to-pink-500 shadow-purple-500/20',
        },
        {
            num: '02',
            icon: <ShieldCheck className="w-5 h-5" />,
            title: t('step2Title'),
            desc: t('step2Desc'),
            color: 'from-blue-500 to-indigo-500 shadow-blue-500/20',
        },
        {
            num: '03',
            icon: <Globe className="w-5 h-5" />,
            title: t('step3Title'),
            desc: t('step3Desc'),
            color: 'from-indigo-500 to-purple-500 shadow-indigo-500/20',
        },
        {
            num: '04',
            icon: <Coins className="w-5 h-5" />,
            title: t('step4Title'),
            desc: t('step4Desc'),
            color: 'from-pink-500 to-rose-500 shadow-pink-500/20',
        },
    ];

    return (
        <section className="py-24 bg-zinc-950/20 border-t border-zinc-900/60 relative overflow-visible">
            {/* Left corner glow, visible right above Platforms section */}
            <div className="pointer-events-none absolute left-[-15%] bottom-[-20%] z-0 h-[600px] w-[600px] rounded-full bg-purple-600/20 blur-[130px] animate-glow-1" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
                    
                    {/* Left Sticky Column */}
                    <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24 lg:h-fit">
                        <div className="space-y-4">
                            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
                                {t('howItWorksTitle')}
                            </h2>
                            <p className="text-zinc-400 text-sm sm:text-base font-light leading-relaxed max-w-lg">
                                {t('howItWorksSubtitle')}
                            </p>
                        </div>
                        {/* Decorative Gradient line */}
                        <div className="h-[2px] w-24 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full" />
                    </div>

                    {/* Right Timeline Column */}
                    <div className="lg:col-span-7 relative">
                        {/* Vertical connection line aligned to the center of the circles (pl-6 + half of w-16 = 24px + 32px = 56px) */}
                        <div className="absolute left-[56px] top-14 bottom-14 w-[2px] bg-gradient-to-b from-purple-500/40 via-indigo-500/40 to-pink-500/10 z-0 hidden sm:block" />

                        <div className="space-y-8">
                            {steps.map((step, idx) => (
                                <div
                                    key={idx}
                                    className="group relative flex flex-col sm:flex-row items-start gap-6 bg-zinc-900/10 hover:bg-zinc-900/20 border border-zinc-900/60 hover:border-zinc-800/80 p-6 rounded-2xl transition-all duration-300 shadow-xl"
                                >
                                    {/* Number Badge with Gradient Circle */}
                                    <div className={`relative z-10 flex-shrink-0 w-16 h-16 rounded-full bg-gradient-to-br ${step.color} flex items-center justify-center text-white shadow-lg font-bold text-lg sm:text-xl group-hover:scale-105 transition-transform duration-300`}>
                                        {step.num}
                                    </div>

                                    {/* Step Content */}
                                    <div className="space-y-2">
                                        <h3 className="text-lg font-bold text-white group-hover:text-purple-300 transition-colors duration-300">
                                            {step.title}
                                        </h3>
                                        <p className="text-zinc-400 text-sm leading-relaxed font-light">
                                            {step.desc}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
