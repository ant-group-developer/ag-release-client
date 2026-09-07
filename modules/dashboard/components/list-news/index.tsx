import SeeMoreButton from '@/components/ui/button/see-more-button';
import { APP_ROUTES } from '@/enums/routes';
import { Link } from '@/i18n/routing';
import PostCard from '@/modules/news/components/post-card';
import { NEWS_STATUS } from '@/modules/news/enums';
import { useGetListNewsPublic } from '@/modules/news/hooks/use-get-list-public';
import { RightOutlined } from '@ant-design/icons';
import { Card, Col, Empty, Row, Skeleton, theme } from 'antd';
import { useTranslations } from 'next-intl';

type Props = {};

export default function ListNews({}: Props) {
    const messages = useTranslations();
    const { token } = theme.useToken();
    const { newsData, isFetching } = useGetListNewsPublic({
        pageSize: 4,
        status: NEWS_STATUS.PUBLIC,
    });
    const newsDataLength = newsData?.metadata?.totalItems ?? 0;

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
                        title={messages('dashboard.latestNews')}
                    >
                        {messages('dashboard.latestNews')}
                    </h3>

                    {!isFetching && (
                        <Link href={APP_ROUTES.NEWS} className="shrink-0">
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
            {isFetching ? (
                <Row gutter={[20, 20]}>
                    {Array.from({ length: 4 }).map((_, index) => (
                        <Col key={index} xs={24} sm={12} md={12} lg={6}>
                            <Card className="rounded-2xl">
                                <Skeleton.Node
                                    active
                                    className="!mb-4 !h-10 !w-10 !rounded-xl"
                                />
                                <Skeleton
                                    active
                                    paragraph={{ rows: 2 }}
                                    title={{ width: '80%' }}
                                />
                            </Card>
                        </Col>
                    ))}
                </Row>
            ) : newsData?.items && newsData.items.length > 0 ? (
                <Row gutter={[20, 20]}>
                    {newsData.items.slice(0, 4).map((item) => (
                        <Col
                            key={item.id.toString()}
                            xs={24}
                            sm={12}
                            md={12}
                            lg={6}
                        >
                            <Link
                                href={`${APP_ROUTES.NEWS}/${item?.slug}`}
                                className="block h-full"
                            >
                                <PostCard data={item} />
                            </Link>
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
