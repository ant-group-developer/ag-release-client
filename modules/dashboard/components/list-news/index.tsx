import SeeMoreButton from '@/components/ui/button/see-more-button';
import { PAGE_SIZE_EXTRA_LARGE } from '@/constants/page-size';
import { APP_ROUTES } from '@/enums/routes';
import PostCard from '@/modules/news/components/post-card';
import { useGetListNewsPublic } from '@/modules/news/hooks/use-get-list-public';
import { RightOutlined } from '@ant-design/icons';
import { Skeleton } from 'antd';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import 'swiper/css'; // style cơ bản
import 'swiper/css/pagination'; // nếu dùng pagination
import { Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

type Props = {};

export default function ListNews({}: Props) {
    const messages = useTranslations();
    const { newsData, isFetching } = useGetListNewsPublic({
        pageSize: PAGE_SIZE_EXTRA_LARGE,
    });
    // const { token } = theme.useToken();
    const newsDataLength = newsData?.metadata?.totalItems;

    if (newsDataLength < 1) return;

    return (
        <div className="my-8 space-y-4">
            <div className="flex items-center justify-between">
                <p className="text-lg font-bold">
                    {messages('dashboard.latestNews')}
                </p>
                {newsDataLength >= 7 && (
                    <Link href={APP_ROUTES.NEWS}>
                        <SeeMoreButton type="link" icon={<RightOutlined />} />
                    </Link>
                )}
            </div>

            {isFetching && (
                <div className="flex gap-4">
                    <Skeleton.Node active className="min-h-64 !w-full" />
                    <Skeleton.Node active className="min-h-64 !w-full" />
                    <Skeleton.Node active className="min-h-64 !w-full" />
                    <Skeleton.Node active className="min-h-64 !w-full" />
                    <Skeleton.Node active className="min-h-64 !w-full" />
                </div>
            )}

            {!isFetching && (
                <Swiper
                    modules={[Pagination, Navigation]}
                    spaceBetween={20}
                    slidesPerView={5}
                    // navigation
                    pagination={{ clickable: true }}
                >
                    {newsData?.items?.map((item, index) => (
                        <SwiperSlide className="pb-8" key={index}>
                            <Link href={`${APP_ROUTES.NEWS}/${item?.slug}`}>
                                <PostCard data={item} />
                            </Link>
                        </SwiperSlide>
                    ))}
                </Swiper>
            )}
        </div>
    );
}
