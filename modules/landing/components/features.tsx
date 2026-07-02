'use client';

import { UploadCloud, Music, LineChart } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function Features() {
    const t = useTranslations('landing');

    return (
        <section className="py-20 bg-zinc-950/40 border-t border-zinc-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
                <div className="text-center space-y-4">
                    <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
                        {t('featuresTitle')}
                    </h2>
                    <p className="text-zinc-400 max-w-xl mx-auto text-sm sm:text-base font-light">
                        {t('featuresSubtitle')}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Feature 1 */}
                    <div className="group bg-zinc-900/30 hover:bg-zinc-900/60 border border-zinc-900 hover:border-zinc-800/80 p-8 rounded-2xl transition-all duration-300 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400 mb-6 group-hover:scale-110 transition-transform">
                            <UploadCloud className="w-6 h-6" />
                        </div>
                        <h3 className="text-lg font-bold text-white mb-2 group-hover:text-purple-300 transition-colors">
                            {t('easyUpload')}
                        </h3>
                        <p className="text-zinc-400 text-sm leading-relaxed">
                            {t('easyUploadDesc')}
                        </p>
                    </div>

                    {/* Feature 2 */}
                    <div className="group bg-zinc-900/30 hover:bg-zinc-900/60 border border-zinc-900 hover:border-zinc-800/80 p-8 rounded-2xl transition-all duration-300 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 mb-6 group-hover:scale-110 transition-transform">
                            <Music className="w-6 h-6" />
                        </div>
                        <h3 className="text-lg font-bold text-white mb-2 group-hover:text-indigo-300 transition-colors">
                            {t('smartDist')}
                        </h3>
                        <p className="text-zinc-400 text-sm leading-relaxed">
                            {t('smartDistDesc')}
                        </p>
                    </div>

                    {/* Feature 3 */}
                    <div className="group bg-zinc-900/30 hover:bg-zinc-900/60 border border-zinc-900 hover:border-zinc-800/80 p-8 rounded-2xl transition-all duration-300 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-pink-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="w-12 h-12 rounded-xl bg-pink-500/10 flex items-center justify-center text-pink-400 mb-6 group-hover:scale-110 transition-transform">
                            <LineChart className="w-6 h-6" />
                        </div>
                        <h3 className="text-lg font-bold text-white mb-2 group-hover:text-pink-300 transition-colors">
                            {t('detailedAnalytics')}
                        </h3>
                        <p className="text-zinc-400 text-sm leading-relaxed">
                            {t('detailedAnalyticsDesc')}
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
