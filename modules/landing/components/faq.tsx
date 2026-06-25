'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { ChevronDown } from 'lucide-react';

import { useGetSettingPublic } from '@/modules/setting/hooks/use-get-setting-public';

export default function FAQ() {
    const t = useTranslations('landing');
    const [activeIndex, setActiveIndex] = useState<number | null>(null);
    const { settingConfig } = useGetSettingPublic();
    const websiteName = settingConfig?.website?.name || 'ANT Group';

    const faqs = [
        { q: t('faqQ1'), a: t('faqA1') },
        { q: t('faqQ2'), a: t('faqA2') },
        { q: t('faqQ3'), a: t('faqA3') },
    ];

    const toggleFaq = (idx: number) => {
        setActiveIndex(activeIndex === idx ? null : idx);
    };

    return (
        <section className="py-20 bg-zinc-950/20 border-t border-zinc-900">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
                <div className="text-center space-y-4">
                    <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
                        {t('faqTitle')}
                    </h2>
                    <p className="text-zinc-400 max-w-xl mx-auto text-sm sm:text-base font-light">
                        {t('faqSubtitle', { appName: websiteName })}
                    </p>
                </div>

                <div className="space-y-4">
                    {faqs.map((faq, idx) => {
                        const isOpen = activeIndex === idx;
                        return (
                            <div
                                key={idx}
                                className="bg-zinc-900/10 border border-zinc-900 hover:border-zinc-800 rounded-2xl overflow-hidden transition-colors"
                            >
                                <button
                                    onClick={() => toggleFaq(idx)}
                                    className="w-full px-6 py-5 flex items-center justify-between text-left font-semibold text-white focus:outline-none"
                                >
                                    <span className="text-sm sm:text-base pr-4">{faq.q}</span>
                                    <ChevronDown
                                        className={`w-5 h-5 text-zinc-500 transition-transform duration-300 ${
                                            isOpen ? 'rotate-180 text-purple-400' : ''
                                        }`}
                                    />
                                </button>
                                <div
                                    className={`transition-all duration-300 ease-in-out ${
                                        isOpen ? 'max-h-96 border-t border-zinc-900/50' : 'max-h-0'
                                    }`}
                                >
                                    <div className="p-6 text-zinc-400 text-xs sm:text-sm leading-relaxed">
                                        {faq.a}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
