'use client';

import { Link } from '@/i18n/routing';
import CardNews from '@/modules/dashboard/components/card/card-news';
import { useTranslations } from 'next-intl';
import 'swiper/css'; // style cơ bản
import 'swiper/css/pagination'; // nếu dùng pagination
import { Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { NewsData } from '../types';

type Props = {
    data: NewsData[];
};

function RelatedNews({ data = [] }: Props) {
    const messages = useTranslations();
    return (
        <div>
            <div className="flex items-center justify-between pb-2">
                <p className="mb-2 text-xl font-bold">
                    {messages('newsPost.related')}
                </p>
            </div>
            <Swiper
                modules={[Pagination, Navigation]}
                spaceBetween={20}
                slidesPerView={5}
                // navigation
                pagination={{ clickable: true }}
            >
                {data.map((item, index) => (
                    <SwiperSlide key={index}>
                        <Link href={`/news/${item?.slug}`}>
                            <CardNews data={item} />
                        </Link>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
}

export default RelatedNews;
