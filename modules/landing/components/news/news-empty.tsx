'use client';

import { Newspaper } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function NewsEmpty() {
    const t = useTranslations('landing');

    return (
        <div className="flex flex-col items-center justify-center space-y-4 py-24 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full border border-zinc-800/80 bg-zinc-900/50 text-zinc-500 shadow-lg">
                <Newspaper className="h-8 w-8 text-zinc-500" />
            </div>
            <div className="space-y-1">
                <p className="text-sm font-medium text-zinc-300 sm:text-base">
                    {t('newsEmpty')}
                </p>
                <p className="text-xs font-light text-zinc-500 sm:text-sm">
                    {t('newsEmptyDesc')}
                </p>
            </div>
        </div>
    );
}
