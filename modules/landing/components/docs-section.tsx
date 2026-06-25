'use client';

import { PAGE_SIZE_EXTRA_LARGE } from '@/constants/page-size';
import { LOCALE } from '@/enums/common';
import { Link } from '@/i18n/routing';
import { useGetListNewsCategory } from '@/modules/news-category/hooks/use-get-list';
import { useGetListNewsPublic } from '@/modules/news/hooks/use-get-list-public';
import { NewsData } from '@/modules/news/types';
import { ArrowUpRight, BookOpen } from 'lucide-react';
import { useEffect, useState } from 'react';

import { useTranslations } from 'next-intl';

interface DocsSectionProps {
    locale: string;
}

export default function DocsSection({ locale }: DocsSectionProps) {
    const t = useTranslations('landing');
    const isVi = locale === LOCALE.VI;

    const [selectedCategoryId, setSelectedCategoryId] = useState<
        string | undefined
    >(undefined);

    // Fetch news categories to find the "Tài liệu" / "Documentation" category
    const { newsCategoryData, isLoading: isCategoryLoading } =
        useGetListNewsCategory({
            pageSize: PAGE_SIZE_EXTRA_LARGE,
            page: 1,
        });

    const docCategory = newsCategoryData?.items?.find((cat) => {
        const nameVi = cat.nameVi?.toLowerCase() || '';
        const nameEn = cat.nameEn?.toLowerCase() || '';
        return nameVi.includes('tài liệu') || nameEn.includes('documentation');
    });

    // Sub categories belonging to the main documentation category
    const subCategories =
        newsCategoryData?.items?.filter(
            (cat) => cat.parentId === docCategory?.id
        ) ??
        docCategory?.children ??
        [];

    // Automatically set selectedCategoryId to docCategory.id if not set
    useEffect(() => {
        if (docCategory && selectedCategoryId === undefined) {
            setSelectedCategoryId(docCategory.id);
        }
    }, [docCategory, selectedCategoryId]);

    // Fetch news posts belonging to the selected category (default is docCategory.id)
    const { newsData, isLoading: isNewsLoading } = useGetListNewsPublic(
        {
            newsCategoryId: selectedCategoryId || docCategory?.id,
            languageCode: locale,
            pageSize: 100, // Fetch all documentation posts to display in list
            page: 1,
        },
        {
            enabled: !!selectedCategoryId && !!docCategory,
        }
    );

    const posts = newsData?.items ?? [];

    const handleCategoryChange = (categoryId: string) => {
        setSelectedCategoryId(categoryId);
    };

    if (isCategoryLoading) {
        return (
            <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
                <div className="mb-12 animate-pulse space-y-4 text-center">
                    <div className="mx-auto h-10 w-64 rounded bg-zinc-800" />
                    <div className="mx-auto mt-2 h-4 w-96 rounded bg-zinc-800/60" />
                </div>
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {Array.from({ length: 3 }).map((_, idx) => (
                        <div
                            key={idx}
                            className="flex h-64 animate-pulse flex-col justify-between rounded-2xl border border-zinc-900/60 bg-zinc-900/20 p-6 shadow-lg"
                        >
                            <div className="space-y-4">
                                <div className="h-12 w-12 rounded-xl bg-zinc-800" />
                                <div className="space-y-2">
                                    <div className="h-6 w-3/4 rounded bg-zinc-800" />
                                    <div className="h-4 w-full rounded bg-zinc-800/60" />
                                    <div className="h-4 w-5/6 rounded bg-zinc-800/60" />
                                </div>
                            </div>
                            <div className="h-4 w-24 rounded bg-zinc-800" />
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <div className="mb-12 space-y-4 text-center">
                <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-5xl">
                    {t('docsTitle')}
                </h1>
                <p className="mx-auto max-w-xl text-sm font-light text-zinc-400 sm:text-base">
                    {t('docsSubtitle')}
                </p>
            </div>

            {/* Category Filter Tabs */}
            {docCategory && (
                <div className="mb-10 flex flex-wrap justify-center gap-3">
                    <button
                        onClick={() => handleCategoryChange(docCategory.id)}
                        className={`rounded-full border px-5 py-2.5 text-xs font-semibold uppercase tracking-wide transition-all duration-300 ${
                            selectedCategoryId === docCategory.id
                                ? 'border-purple-500 bg-purple-600 text-white shadow-md shadow-purple-500/10'
                                : 'border-zinc-800 bg-zinc-900/40 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
                        }`}
                    >
                        {t('docsAllCategory')}
                    </button>
                    {subCategories.map((subCat) => {
                        const isActive = selectedCategoryId === subCat.id;
                        const name = isVi ? subCat.nameVi : subCat.nameEn;
                        return (
                            <button
                                key={subCat.id}
                                onClick={() => handleCategoryChange(subCat.id)}
                                className={`rounded-full border px-5 py-2.5 text-xs font-semibold uppercase tracking-wide transition-all duration-300 ${
                                    isActive
                                        ? 'border-purple-500 bg-purple-600 text-white shadow-md shadow-purple-500/10'
                                        : 'border-zinc-800 bg-zinc-900/40 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
                                }`}
                            >
                                {name}
                            </button>
                        );
                    })}
                </div>
            )}

            {isNewsLoading ? (
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {Array.from({ length: 3 }).map((_, idx) => (
                        <div
                            key={idx}
                            className="flex h-64 animate-pulse flex-col justify-between rounded-2xl border border-zinc-900/60 bg-zinc-900/20 p-6 shadow-lg"
                        >
                            <div className="space-y-4">
                                <div className="h-12 w-12 rounded-xl bg-zinc-800" />
                                <div className="space-y-2">
                                    <div className="h-6 w-3/4 rounded bg-zinc-800" />
                                    <div className="h-4 w-full rounded bg-zinc-800/60" />
                                    <div className="h-4 w-5/6 rounded bg-zinc-800/60" />
                                </div>
                            </div>
                            <div className="h-4 w-24 rounded bg-zinc-800" />
                        </div>
                    ))}
                </div>
            ) : posts.length === 0 ? (
                <div className="mx-auto flex min-h-[300px] flex-col items-center justify-center space-y-4 text-center">
                    <BookOpen className="h-12 w-12 animate-bounce text-zinc-600" />
                    <h3 className="text-lg font-bold text-white">
                        {t('docsNoDataTitle')}
                    </h3>
                    <p className="max-w-sm text-sm font-light text-zinc-500">
                        {t('docsNoDataDesc')}
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {posts.map((post: NewsData) => (
                        <Link
                            key={post.id}
                            href={`/landing/news/${post.slug}`}
                            className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-zinc-900/60 bg-zinc-900/20 p-6 shadow-lg transition-all duration-300 hover:scale-[1.01] hover:border-purple-500/30 hover:bg-purple-950/10 hover:shadow-purple-500/5"
                        >
                            <div className="space-y-4">
                                <div className="inline-flex rounded-xl border border-purple-500/20 bg-purple-600/10 p-3 text-purple-400">
                                    <BookOpen className="h-6 w-6" />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="line-clamp-2 text-lg font-bold text-white transition-colors group-hover:text-purple-300">
                                        {post.title}
                                    </h3>
                                    <p className="line-clamp-3 text-sm font-light leading-relaxed text-zinc-400">
                                        {post.description || post.title}
                                    </p>
                                </div>
                            </div>
                            <div className="mt-6 flex items-center justify-between border-t border-zinc-900/60 pt-4 text-xs font-medium text-purple-400">
                                <span>{t('docsReadGuide')}</span>
                                <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
