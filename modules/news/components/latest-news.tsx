import { getListPostPublic } from '@/app/api/newsPost';
import { PaginationResponse } from '@/types/api';
import dayjs from 'dayjs';
import { getLocale, getTranslations } from 'next-intl/server';
import Image from 'next/image';
import Link from 'next/link';
import { NewsData } from '../types';

const LATEST_NEWS_LIMIT = 6;

type Props = {};

export default async function LatestNews({}: Props) {
    const t = await getTranslations();
    const locale = await getLocale();
    const res = await getListPostPublic({ pageSize: LATEST_NEWS_LIMIT, languageCode: locale });
    const data = res?.data as PaginationResponse<NewsData>['data'];
    const latestNews = [...(data?.items ?? [])].slice(0, LATEST_NEWS_LIMIT).sort(
        (a, b) => dayjs(b.createdAt).diff(dayjs(a.createdAt)) // DESC
    );

    return (
        <div className="sticky top-5 h-full max-h-[90vh] w-[300px] overflow-y-auto rounded-lg">
            <p className="mb-4 text-lg font-bold uppercase text-gray-900 dark:text-white">
                {t('newsPost.latest')}
            </p>

            <ul>
                {latestNews?.map((item, index) => (
                    <li key={item.id} className="border-b border-gray-100 dark:border-zinc-700 py-4">
                        <Link
                            href={`/news/${item?.slug}`}
                            className="group/latest flex items-start gap-4"
                        >
                            <span className="text-xl font-bold text-rose-600 min-w-[24px] pt-0.5">
                                {index + 1}.
                            </span>

                            <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-gray-900 dark:text-zinc-100 leading-snug group-hover/latest:text-blue-500 dark:group-hover/latest:text-blue-400 line-clamp-3 break-words text-sm sm:text-base lg:text-sm">
                                    {item?.title}
                                </h3>
                            </div>

                            <div className="relative aspect-[3/2] w-20 sm:w-24 shrink-0 overflow-hidden rounded-md">
                                <Image
                                    src={item?.thumbnail}
                                    alt=""
                                    className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-300 group-hover/latest:scale-105"
                                    width={120}
                                    height={80}
                                />
                            </div>
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}
