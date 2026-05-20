import SeeMoreButton from '@/components/ui/button/see-more-button';
import { APP_ROUTES } from '@/enums/routes';
import { Link } from '@/i18n/routing';
import { ReleasesData } from '@/modules/releases/types';
import { RightOutlined } from '@ant-design/icons';
import { Card, Empty, theme } from 'antd';
import { useTranslations } from 'next-intl';
import 'swiper/css';
import 'swiper/css/pagination';
import { Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import CardRelease from '../card/card-release';

type Props = {
    data: ReleasesData[];
};

export default function ListRelease({ data }: Props) {
    const messages = useTranslations();
    const { token } = theme.useToken();
    const releaseLength = data?.length;

    return (
        <Card
            className="overflow-hidden rounded-lg border-0 shadow-sm"
            styles={{
                header: { borderBottom: 0, paddingBottom: 0, paddingTop: 24 },
                body: { padding: '24px' },
            }}
            title={
                <div className="flex items-center justify-between">
                    <h3 className="m-0 text-lg font-bold text-blue-500">
                        {messages('release.latestReleases')}
                    </h3>

                    {releaseLength >= 7 && (
                        <Link href={APP_ROUTES.RELEASES}>
                            <SeeMoreButton
                                type="default"
                                style={{
                                    height: 32,
                                }}
                                icon={<RightOutlined />}
                            />
                        </Link>
                    )}
                </div>
            }
        >
            {releaseLength > 0 && (
                <Swiper
                    modules={[Pagination, Navigation]}
                    spaceBetween={20}
                    slidesPerView={6}
                    // navigation
                    pagination={{ clickable: true }}
                >
                    {data?.map((item) => (
                        <SwiperSlide className="pb-8" key={item.id.toString()}>
                            <CardRelease data={item} />
                        </SwiperSlide>
                    ))}
                </Swiper>
            )}

            {releaseLength <= 0 && (
                <Empty
                    className="!mx-0 rounded-lg py-6"
                    style={{
                        backgroundColor: token.colorBgContainer,
                    }}
                />
            )}
        </Card>
    );
}
