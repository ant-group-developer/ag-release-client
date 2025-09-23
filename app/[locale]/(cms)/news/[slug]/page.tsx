import { getDetailPostBySlug, getListPostPublic } from '@/app/api/newsPost';
import IconButton from '@/components/ui/button/icon-button';
import CKContent from '@/components/ui/text-editor/ck-content';
import CustomTooltip from '@/components/ui/tooltip/custom-tooltip';
import { SIZE_ICON } from '@/constants/common';
import { PAGE_SIZE_EXTRA_LARGE } from '@/constants/page-size';
import { LOCALE } from '@/enums/common';
import { Link } from '@/i18n/routing';
import CopyLink from '@/modules/news/components/copy-link';
import LatestNews from '@/modules/news/components/latest-news';
import RelatedNews from '@/modules/news/components/related-news';
import { NewsData } from '@/modules/news/types';
import { PaginationResponse } from '@/types/api';
import { Facebook } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import 'swiper/css'; // style cơ bản
import 'swiper/css/pagination'; // nếu dùng pagination
type Props = {
    params: { slug: string; locale: string };
};

export default async function NewsDetail({ params }: Props) {
    const slug = params?.slug;
    const post = await getDetailPostBySlug(slug);
    const t = await getTranslations();
    const content =
        params?.locale === LOCALE.VI ? post?.contentVi : post?.contentEn;
    const res = await getListPostPublic({
        pageSize: PAGE_SIZE_EXTRA_LARGE,
        newsCategoryId: post?.newsCategoryId,
    });
    const newsData = res?.data as PaginationResponse<NewsData>['data'];
    const currentURL =
        typeof window === 'undefined' ? '' : window.location.href;
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
                    <CKContent value={content} className="font-normal" />
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
