import SeeMoreButton from '@/components/ui/button/see-more-button';
import { APP_ROUTES } from '@/enums/routes';
import { Link } from '@/i18n/routing';
import { RELEASE_TYPE } from '@/modules/releases/enums';
import { ReleasesData } from '@/modules/releases/types';
import { RightOutlined } from '@ant-design/icons';
import { Card, Col, Empty, Row, Skeleton, theme } from 'antd';
import { useTranslations } from 'next-intl';
// import 'swiper/css';
// import 'swiper/css/pagination';
// import { Navigation, Pagination } from 'swiper/modules';
// import { Swiper, SwiperSlide } from 'swiper/react';
import CardRelease from '../card/card-release';

type Props = {
    data: ReleasesData[];
    loading?: boolean;
    releaseType?: RELEASE_TYPE | string;
};

export default function ListRelease({ data, loading, releaseType }: Props) {
    const messages = useTranslations();
    const { token } = theme.useToken();
    const releaseLength = data?.length;

    const getTitle = () => {
        if (releaseType === RELEASE_TYPE.VIDEO) {
            return messages('release.latestVideoReleases');
        }
        if (releaseType === RELEASE_TYPE.AUDIO) {
            return messages('release.latestAudioReleases');
        }
        return messages('release.latestReleases');
    };

    const getSeeMoreHref = () => {
        if (releaseType === RELEASE_TYPE.VIDEO) {
            return APP_ROUTES.RELEASE_VIDEOS;
        }
        return APP_ROUTES.RELEASES;
    };

    return (
        <Card
            className="overflow-hidden rounded-lg border-0 shadow-sm"
            styles={{
                header: { borderBottom: 0, paddingBottom: 0, paddingTop: 24 },
                body: { padding: '24px' },
            }}
            title={
                <div className="flex items-center justify-between gap-2 min-w-0">
                    <h3
                        className="text-md m-0 font-bold truncate min-w-0"
                        title={getTitle()}
                    >
                        {getTitle()}
                    </h3>

                    {!loading && releaseLength >= 7 && (
                        <Link href={getSeeMoreHref()} className="shrink-0">
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
            {loading ? (
                <Row gutter={[20, 20]}>
                    {Array.from({ length: 6 }).map((_, index) => (
                        <Col key={index} xs={24} sm={12} md={8} lg={4}>
                            <Card
                                cover={
                                    <div className="relative aspect-square w-full overflow-hidden rounded-t-lg">
                                        <Skeleton.Node
                                            active
                                            className="!h-full !w-full"
                                        />
                                    </div>
                                }
                            >
                                <Skeleton
                                    active
                                    paragraph={{ rows: 1 }}
                                    title={{ width: '60%' }}
                                />
                            </Card>
                        </Col>
                    ))}
                </Row>
            ) : releaseLength > 0 ? (
                <Row gutter={[20, 20]}>
                    {data.slice(0, 6).map((release) => (
                        <Col
                            key={release.id.toString()}
                            xs={24}
                            sm={12}
                            md={8}
                            lg={4}
                        >
                            <CardRelease data={release} />
                        </Col>
                    ))}
                </Row>
            ) : (
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
