'use client';

import { DATE_FORMAT } from '@/enums/common';
import { APP_ROUTES } from '@/enums/routes';
import { getNameByLocale } from '@/helpers/string';
import { Link } from '@/i18n/routing';
import { NewsData } from '@/modules/news/types';
import dayjs from 'dayjs';
import { Calendar } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import Image from 'next/image';

interface NewsCardProps {
    post: NewsData;
}

export default function NewsCard({ post }: NewsCardProps) {
    const locale = useLocale();
    const t = useTranslations('landing');

    return (
        <Link
            href={`${APP_ROUTES.LANDING_NEWS}/${post.slug}`}
            className="group flex h-full cursor-pointer flex-col overflow-hidden rounded-2xl border border-zinc-900/60 bg-zinc-900/20 shadow-lg transition-all duration-300 hover:border-zinc-800 hover:bg-zinc-900/40"
        >
            {post.thumbnail && (
                <div className="relative aspect-[16/9] w-full overflow-hidden border-b border-zinc-900 bg-zinc-950">
                    <Image
                        src={post.thumbnail}
                        alt={post.title}
                        fill
                        className="object-contain transition-transform duration-500 group-hover:scale-105"
                    />
                </div>
            )}
            <div className="flex flex-1 flex-col justify-between space-y-4 p-6">
                <div className="space-y-2">
                    <span className="text-xs font-medium text-purple-400">
                        {getNameByLocale(
                            post.newsCategory?.nameEn,
                            post.newsCategory?.nameVi,
                            locale
                        )}
                    </span>
                    <h3 className="line-clamp-2 text-lg font-bold text-white transition-colors group-hover:text-purple-300">
                        {post.title}
                    </h3>
                    <p className="line-clamp-3 text-sm font-light leading-relaxed text-zinc-400">
                        {post.description || post.title}
                    </p>
                </div>
                <div className="flex items-center justify-between border-t border-zinc-900/60 pt-2 text-xs text-zinc-500">
                    <span className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5" />
                        {dayjs(post.createdAt).format(DATE_FORMAT.DATE_ONLY)}
                    </span>
                    <span className="text-purple-400 transition-transform group-hover:translate-x-1">
                        {t('newsReadMore')}
                    </span>
                </div>
            </div>
        </Link>
    );
}
