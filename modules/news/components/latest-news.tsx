import { getListPostPublic } from '@/app/api/newsPost';
import { PaginationResponse } from '@/types/api';
import dayjs from 'dayjs';
import { getLocale, getTranslations } from 'next-intl/server';
import Image from 'next/image';
import Link from 'next/link';
import { NewsData } from '../types';

type Props = {};

export default async function LatestNews({}: Props) {
    const t = await getTranslations();
    const locale = await getLocale();
    const res = await getListPostPublic({ pageSize: 6, languageCode: locale });
    const data = res?.data as PaginationResponse<NewsData>['data'];
    const latestNews = [...(data?.items ?? [])].slice(0, 6).sort(
        (a, b) => dayjs(b.createdAt).diff(dayjs(a.createdAt)) // DESC
    );

    return (
        <div className="sticky top-5 h-full max-h-[90vh] overflow-y-auto rounded-lg">
            <p className="mb-5 text-xl font-bold">{t('newsPost.latest')}</p>

            <ul>
                {latestNews?.map((item) => (
                    <li key={item.id} className="mb-5 hover:text-blue-500">
                        <Link
                            href={`/news/${item?.slug}`}
                            className="group/latest grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-2"
                        >
                            <div className="relative aspect-[5/3] w-full overflow-hidden rounded-lg">
                                <Image
                                    src={item?.thumbnail}
                                    alt=""
                                    className="absolute inset-0 h-full w-full object-cover object-center"
                                    width={300}
                                    height={200}
                                />
                            </div>

                            <div className="line-clamp-4 text-wrap">
                                <h3 className="break-words font-semibold sm:line-clamp-1 md:line-clamp-2 lg:line-clamp-4">
                                    {item?.title}
                                </h3>
                                {/* <p>
                                    {getNameByLocale(
                                        item?.descriptionEn,
                                        item?.descriptionVi,
                                        locale
                                    )}
                                </p> */}
                            </div>
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}
