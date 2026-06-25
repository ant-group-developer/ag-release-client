import { getDetailPostBySlug, getListPostPublic } from '@/app/api/newsPost';
import CKContent from '@/components/ui/text-editor/ck-content';
import { SIZE_ICON } from '@/constants/common';
import { PAGE_SIZE_EXTRA_LARGE } from '@/constants/page-size';
import { APP_ROUTES } from '@/enums/routes';
import { formattedDate } from '@/helpers/common';
import CopyLink from '@/modules/news/components/copy-link';
import LatestNews from '@/modules/news/components/latest-news';
import ShareFacebook from '@/modules/news/components/share-facebook';
import { NewsData } from '@/modules/news/types';
import { PaginationResponse } from '@/types/api';
import { Breadcrumb } from 'antd';
import { Home, Newspaper } from 'lucide-react';
import { getLocale, getTranslations } from 'next-intl/server';
import 'swiper/css'; // style cơ bản
import 'swiper/css/pagination'; // nếu dùng pagination
type Props = {
    params: { slug: string; locale: string };
};

export default async function NewsDetail({ params }: Props) {
    const slug = params?.slug;
    const locale = await getLocale();
    const post = await getDetailPostBySlug(slug, locale);
    const t = await getTranslations();

    const res = await getListPostPublic({
        pageSize: PAGE_SIZE_EXTRA_LARGE,
        newsCategoryId: post?.newsCategoryId,
        languageCode: locale,
    });
    const content = post?.content;
    const newsData = res?.data as PaginationResponse<NewsData>['data'];

    const breadCrumbItems = [
        {
            href: APP_ROUTES.DASHBOARD,
            title: (
                <div className="flex items-center gap-2">
                    <Home size={SIZE_ICON} />
                    <span>{t('dashboard.label')}</span>
                </div>
            ),
        },
        {
            href: APP_ROUTES.NEWS,
            title: (
                <div className="flex items-center gap-2">
                    <Newspaper size={SIZE_ICON} />
                    <span>{t('news.label')}</span>
                </div>
            ),
        },
        {
            title: post?.title,
        },
    ];

    if (!post || !content) {
        return (
            <div className="mx-auto w-full max-w-screen-xl py-5">
                <h2 className="text-center text-xl font-semibold">
                    {t('common.notAvailable')}
                </h2>
            </div>
        );
    }

    return (
        <div className="min-h-full w-full bg-white dark:bg-zinc-800">
            <div className="mx-auto w-full max-w-screen-xl space-y-8 px-4 pb-5">
                <div className="py-2">
                    <Breadcrumb items={breadCrumbItems} />
                </div>
                <div className="grid grid-cols-12 justify-center gap-8">
                    <div className="col-span-1">
                        <div className="sticky top-5 flex flex-col gap-4">
                            <ShareFacebook />

                            <CopyLink />
                        </div>
                    </div>
                    <div className="col-span-11 rounded-lg lg:col-span-7">
                        <div>
                            <strong className="text-2xl font-extrabold">
                                {post?.title}
                            </strong>
                            <div className="pt-4">
                                <span className="italic text-gray-500">
                                    {formattedDate(post?.createdAt)}
                                </span>
                            </div>
                        </div>
                        <CKContent
                            value={content || ''}
                            className="font-normal"
                        />
                    </div>
                    <div className="col-span-4 hidden lg:block">
                        <LatestNews />
                    </div>
                </div>
                {/* <div>
                    <RelatedNews data={newsData?.items} />
                </div> */}
            </div>
        </div>
    );
}
