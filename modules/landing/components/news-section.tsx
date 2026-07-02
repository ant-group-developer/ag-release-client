'use client';

import { useFilter } from '@/hooks/use-filter';
import { useGetListNewsPublic } from '@/modules/news/hooks/use-get-list-public';
import { NewsData, NewsDataFilter } from '@/modules/news/types';
import NewsCard from './news/news-card';
import NewsEmpty from './news/news-empty';
import NewsFilters from './news/news-filters';
import NewsHeader from './news/news-header';
import NewsPagination from './news/news-pagination';

const DEFAULT_PAGE_SIZE = 6;
const DEFAULT_PAGE = 1;

interface NewsSectionProps {
    locale: string;
}

const NewsCardSkeleton = () => (
    <div className="flex h-full animate-pulse flex-col overflow-hidden rounded-2xl border border-zinc-900/60 bg-zinc-900/20 shadow-lg">
        {/* Aspect ratio and border matching the actual card image */}
        <div className="aspect-[16/10] w-full border-b border-zinc-900 bg-zinc-800/30" />
        <div className="flex flex-1 flex-col justify-between space-y-4 p-6">
            <div className="space-y-3">
                {/* Category tag skeleton */}
                <div className="h-3 w-1/4 rounded bg-zinc-800" />
                {/* Title lines skeleton */}
                <div className="space-y-2">
                    <div className="h-5 w-5/6 rounded bg-zinc-800" />
                    <div className="h-5 w-2/3 rounded bg-zinc-800" />
                </div>
                {/* Description lines skeleton */}
                <div className="space-y-2 pt-1">
                    <div className="h-3.5 w-full rounded bg-zinc-800/40" />
                    <div className="h-3.5 w-full rounded bg-zinc-800/40" />
                    <div className="h-3.5 w-4/5 rounded bg-zinc-800/40" />
                </div>
            </div>
            {/* Footer details skeleton */}
            <div className="flex items-center justify-between border-t border-zinc-900/60 pt-4">
                <div className="h-3.5 w-1/3 rounded bg-zinc-800/50" />
                <div className="h-3.5 w-1/4 rounded bg-zinc-800/50" />
            </div>
        </div>
    </div>
);

export default function NewsSection({ locale }: NewsSectionProps) {
    const { dataFilter, onChangePage, onChangeFilter, onSearch } = useFilter<NewsDataFilter>({
        page: DEFAULT_PAGE,
        pageSize: DEFAULT_PAGE_SIZE,
    });

    // Fetch news posts using custom React Query hook with server-side filtering and pagination
    const { newsData, isLoading: isNewsLoading } = useGetListNewsPublic({
        ...dataFilter,
        languageCode: locale,
    });

    return (
        <div className="mx-auto max-w-7xl space-y-12 px-4 py-16 sm:px-6 lg:px-8">
            <NewsHeader />

            <NewsFilters
                dataFilter={dataFilter}
                onChangeFilter={onChangeFilter}
                onSearch={onSearch}
            />

            <div className="relative min-h-[460px] w-full">
                {isNewsLoading ? (
                    <div className="grid animate-pulse grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                        {Array.from({ length: 3 }).map((_, idx) => (
                            <NewsCardSkeleton key={idx} />
                        ))}
                    </div>
                ) : newsData?.items?.length === 0 ? (
                    <div className="flex min-h-[400px] items-center justify-center">
                        <NewsEmpty />
                    </div>
                ) : (
                    <div className="space-y-12">
                        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                            {newsData?.items?.map((post: NewsData) => (
                                <NewsCard key={post.id} post={post} />
                            ))}
                        </div>
                        <NewsPagination
                            current={dataFilter.page ?? DEFAULT_PAGE}
                            pageSize={dataFilter.pageSize ?? DEFAULT_PAGE_SIZE}
                            total={newsData?.metadata?.totalItems ?? 0}
                            onChangePage={onChangePage}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
