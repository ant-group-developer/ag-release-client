'use client';

import { useTranslations } from 'next-intl';

export default function Platforms() {
    const t = useTranslations('landing');

    const platforms = [
        {
            name: 'Spotify',
            icon: (
                <img
                    src="/icon/spotify.png"
                    alt="Spotify"
                    className="w-9 h-9 object-contain opacity-60 group-hover:opacity-100 transition-opacity duration-300"
                />
            ),
            color: 'hover:text-[#1DB954] hover:border-[#1DB954]/40 hover:bg-[#1DB954]/5'
        },
        {
            name: 'Apple Music',
            icon: (
                <img
                    src="/icon/apple-music.svg"
                    alt="Apple Music"
                    className="w-9 h-9 object-contain opacity-60 group-hover:opacity-100 transition-opacity duration-300"
                />
            ),
            color: 'hover:text-[#FC3C44] hover:border-[#FC3C44]/40 hover:bg-[#FC3C44]/5'
        },
        {
            name: 'YouTube Music',
            icon: (
                <img
                    src="/icon/youtube.png"
                    alt="YouTube Music"
                    className="w-9 h-9 object-contain opacity-60 group-hover:opacity-100 transition-opacity duration-300"
                />
            ),
            color: 'hover:text-[#FF0000] hover:border-[#FF0000]/40 hover:bg-[#FF0000]/5'
        },
        {
            name: 'TikTok',
            icon: (
                <svg
                    viewBox="0 0 24 24"
                    className="w-9 h-9 fill-current opacity-60 group-hover:opacity-100 transition-opacity duration-300"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.02 1.59 4.23.94 1.18 2.27 2 3.74 2.37v3.98c-1.85-.04-3.66-.75-5.06-1.95v7.69c.02 1.8-.46 3.58-1.42 5.09-1.39 2.18-3.79 3.58-6.4 3.59-2.3-.02-4.51-1.12-5.91-2.95-1.57-2.07-2.09-4.78-1.4-7.33.68-2.52 2.6-4.56 5.11-5.32 1.34-.4 2.76-.36 4.08.1v3.99c-.93-.31-1.94-.28-2.85.11-.94.39-1.68 1.15-2.04 2.12-.42 1.13-.3 2.38.32 3.4.63 1.05 1.77 1.69 3 1.69 1.48-.01 2.82-.98 3.25-2.4.15-.5.22-1.03.21-1.56V0h.03z"/>
                </svg>
            ),
            color: 'hover:text-[#00f2fe] hover:border-[#00f2fe]/40 hover:bg-[#00f2fe]/5'
        },
        {
            name: 'Amazon Music',
            icon: (
                <img
                    src="/icon/amazon.png"
                    alt="Amazon Music"
                    className="w-9 h-9 object-contain opacity-60 group-hover:opacity-100 transition-opacity duration-300"
                />
            ),
            color: 'hover:text-[#00A8E1] hover:border-[#00A8E1]/40 hover:bg-[#00A8E1]/5'
        },
        {
            name: 'Deezer',
            icon: (
                <img
                    src="/icon/deezer.svg"
                    alt="Deezer"
                    className="w-9 h-9 object-contain opacity-60 group-hover:opacity-100 transition-opacity duration-300"
                />
            ),
            color: 'hover:text-[#EF5466] hover:border-[#EF5466]/40 hover:bg-[#EF5466]/5'
        },
        {
            name: 'Tidal',
            icon: (
                <svg
                    viewBox="0 0 24 24"
                    className="w-9 h-9 fill-current opacity-60 group-hover:opacity-100 transition-opacity duration-300"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path d="M12.012 3.6L6.006 9.606l6.006 6.006 6.006-6.006L12.012 3.6zM6 9.618L0 15.624l6 6.006 6.006-6.006L6 9.618zm12.024 0l-6.006 6.006 6 6.006 6.006-6.006-6-6.006z"/>
                </svg>
            ),
            color: 'hover:text-[#00ffff] hover:border-[#00ffff]/40 hover:bg-[#00ffff]/5'
        },
        {
            name: '7digital',
            icon: (
                <img
                    src="/icon/digital.svg"
                    alt="7digital"
                    className="w-9 h-9 object-contain opacity-60 group-hover:opacity-100 transition-opacity duration-300"
                />
            ),
            color: 'hover:text-[#00BFFF] hover:border-[#00BFFF]/40 hover:bg-[#00BFFF]/5'
        },
    ];

    return (
        <section className="py-20 bg-zinc-950/40 border-t border-zinc-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
                <div className="text-center space-y-4">
                    <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
                        {t('platformsTitle')}
                    </h2>
                    <p className="text-zinc-400 max-w-xl mx-auto text-sm sm:text-base font-light">
                        {t('platformsSubtitle')}
                    </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-5xl mx-auto">
                    {platforms.map((platform, idx) => (
                        <div
                            key={idx}
                            className={`group border border-zinc-900 bg-zinc-900/10 rounded-2xl p-6 flex flex-col items-center justify-center gap-3 transition-all duration-300 cursor-pointer ${platform.color}`}
                        >
                            <div className="flex items-center justify-center">
                                {platform.icon}
                            </div>
                            <span className="text-xs sm:text-sm font-semibold tracking-wide group-hover:scale-105 transition-transform duration-300">
                                {platform.name}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
