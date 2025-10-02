import { getDetailPostBySlug, getListPostPublic } from '@/app/api/newsPost';
import IconButton from '@/components/ui/button/icon-button';
import CKContent from '@/components/ui/text-editor/ck-content';
import CustomTooltip from '@/components/ui/tooltip/custom-tooltip';
import { SIZE_ICON } from '@/constants/common';
import { PAGE_SIZE_EXTRA_LARGE } from '@/constants/page-size';
import { APP_ROUTES } from '@/enums/routes';
import { formattedDate } from '@/helpers/common';
import { Link } from '@/i18n/routing';
import CopyLink from '@/modules/news/components/copy-link';
import LatestNews from '@/modules/news/components/latest-news';
import RelatedNews from '@/modules/news/components/related-news';
import { NewsData } from '@/modules/news/types';
import { PaginationResponse } from '@/types/api';
import { Breadcrumb } from 'antd';
import { Facebook, Home, Newspaper } from 'lucide-react';
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
    const currentURL =
        typeof window === 'undefined' ? '' : window.location.href;

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
        <div className="mx-auto w-full max-w-screen-lg space-y-8 pb-5">
            <div className="py-2">
                <Breadcrumb items={breadCrumbItems} />
            </div>
            <div className="grid grid-cols-12 justify-center gap-8">
                <div className="col-span-1">
                    <div className="sticky top-5 flex flex-col gap-4">
                        <CustomTooltip placement="right" title={''}>
                            <Link
                                href={`http://www.facebook.com/sharer.php?u=${currentURL}`}
                                target="_blank"
                            >
                                <IconButton className="size-8 h-8 w-8 rounded-full border">
                                    <Facebook size={SIZE_ICON} />
                                </IconButton>
                            </Link>
                        </CustomTooltip>

                        <CopyLink />
                    </div>
                </div>
                <div className="col-span-7 rounded-lg">
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
                    <CKContent value={content || ''} className="font-normal" />
                </div>
                <div className="col-span-4">
                    <LatestNews />
                </div>
            </div>
            <div>
                <RelatedNews data={newsData?.items} />
            </div>
        </div>
    );
}
