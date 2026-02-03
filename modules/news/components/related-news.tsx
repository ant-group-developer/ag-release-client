'use client';

import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import 'swiper/css'; // style cơ bản
import 'swiper/css/pagination'; // nếu dùng pagination
import { Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { NewsData } from '../types';
import PostCard from './post-card';

type Props = {
    data: NewsData[];
};

function RelatedNews({ data = [] }: Props) {
    const messages = useTranslations();
    return (
        <div>
            <div className="flex items-center justify-between">
                <p className="mb-2 text-xl font-bold">
                    {messages('newsPost.related')}
                </p>
            </div>
            <Swiper
                modules={[Pagination, Navigation]}
                spaceBetween={20}
                slidesPerView={4}
                // navigation
                pagination={{ clickable: true }}
            >
                {data.map((item, index) => (
                    <SwiperSlide className="pb-8 pt-4" key={index}>
                        <Link href={`/news/${item?.slug}`}>
                            {/* <CardNews data={item} /> */}
                            <PostCard data={item} />
                        </Link>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
}

export default RelatedNews;
