import { PAGE_SIZE_EXTRA_LARGE } from '@/constants/page-size';
import { useGetListNewsPublic } from '@/modules/news/hooks/use-get-list-public';
import { Skeleton } from 'antd';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import 'swiper/css'; // style cơ bản
import 'swiper/css/pagination'; // nếu dùng pagination
import { Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import CardNews from '../card/card-news';
type Props = {};

export default function ListNews({}: Props) {
    const messages = useTranslations();
    const { newsData, isFetching } = useGetListNewsPublic({
        pageSize: PAGE_SIZE_EXTRA_LARGE,
    });

    return (
        <div className="my-8">
            <div className="flex items-center justify-between pb-2">
                <p className="text-lg font-bold">
                    {messages('dashboard.latestNews')}
                </p>
                {/* <SeeMoreButton /> */}
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
                        <SwiperSlide key={index}>
                            <Link href={`/news/${item?.slug}`}>
                                <CardNews data={item} />
                            </Link>
                        </SwiperSlide>
                    ))}
                </Swiper>
            )}
        </div>
    );
}
