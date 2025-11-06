'use client';
import AppHeaderPage from '@/components/ant-music/app-header-page';
import ItemHeaderPage from '@/components/ant-music/item-header-page';
import DetailSkeleton from '@/components/ui/skeleton/detail-skeleton';
import { APP_ROUTES } from '@/enums/routes';
import { Link, usePathname, useRouter } from '@/i18n/routing';
import AppError from '@/modules/auth/components/error';
import { LABEL_DETAIL_TABS } from '@/modules/labels/enum';
import { useGetDetailLabel } from '@/modules/labels/hooks/use-get-detail-label';
import { PageContainer } from '@ant-design/pro-components';
import { Tabs, TabsProps, theme } from 'antd';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { PropsWithChildren, useEffect, useRef, useState } from 'react';

export default function LabelDetailLayout({ children }: PropsWithChildren) {
    // Hooks - state
    const messages = useTranslations();

    const [isScroll, setIsScrolled] = useState(false);
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const { token } = theme.useToken();

    // Router - params
    const params = useParams();
    const router = useRouter();
    const labelId = params['label-id'];
    const pathname = usePathname();

    // Apis
    const { labelData, isLoading, error } = useGetDetailLabel(
        labelId as string
    );

    // Const
    const items: TabsProps['items'] = [
        // {
        //     key: LABEL_DETAIL_TABS.OVERVIEW,
        //     label: (
        //         <Link className="pl-4 font-medium" href={`overview`}>
        //             Tổng quan
        //         </Link>
        //     ),
        // },
        {
            key: LABEL_DETAIL_TABS.RELEASES,
            label: (
                <Link className="font-medium" href={LABEL_DETAIL_TABS.RELEASES}>
                    {messages('release.label')}
                </Link>
            ),
        },
        {
            key: LABEL_DETAIL_TABS.TRACKS,
            label: (
                <Link className="font-medium" href={LABEL_DETAIL_TABS.TRACKS}>
                    {messages('track.label')}
                </Link>
            ),
        },
    ];
    const breadcrumb = [
        { title: messages('label.label'), href: APP_ROUTES.LABELS },
        { title: labelData?.name || '' },
    ];

    const tabKey = pathname.split('/').pop();
    const isOverviewPage = tabKey == LABEL_DETAIL_TABS.OVERVIEW;

    useEffect(() => {
        if (!isOverviewPage) {
            setIsScrolled(true);
            return;
        } else {
            setIsScrolled(false);
        }
        const handleScroll = () => {
            const scrollTop = scrollContainerRef.current?.scrollTop || 0;

            setIsScrolled(scrollTop > 0);
        };
        const scrollEl = scrollContainerRef.current;

        if (scrollEl) {
            scrollEl.addEventListener('scroll', handleScroll);
        }
        return () => {
            if (scrollEl) {
                scrollEl.removeEventListener('scroll', handleScroll);
            }
        };
    }, [pathname, isOverviewPage, isScroll]);

    if (error) {
        return <AppError error={error} />;
    }

    if (isLoading || !labelData) {
        return <DetailSkeleton />;
    }

    return (
        <div
            className="h-full min-h-[calc(100vh-64px)] overflow-auto"
            onScroll={(e) => {
                const el = e.currentTarget;
                setIsScrolled(el.scrollTop > 0);
            }}
            style={{ backgroundColor: token.colorBgLayout }}
        >
            <PageContainer
                title={false}
                header={{ breadcrumb: { items: breadcrumb } }}
            >
                <div
                    className="sticky top-0 z-10 mb-4 rounded-lg px-4 py-2"
                    style={{
                        background: token.colorBgContainer,
                    }}
                >
                    <AppHeaderPage
                        imageSrc={labelData?.picture as string}
                        isScrolled={isScroll}
                    >
                        <ItemHeaderPage
                            name={messages('label.label')}
                            value={labelData?.name}
                        />
                        <ItemHeaderPage
                            name={messages('release.label')}
                            value={labelData?.releaseCount?.toString()}
                        />
                        <ItemHeaderPage
                            name={messages('track.label')}
                            value={labelData?.trackCount?.toString()}
                        />
                    </AppHeaderPage>

                    <div>
                        <Tabs
                            activeKey={tabKey}
                            className="tab-release-detail"
                            style={{
                                backgroundColor: token.colorBgContainer,
                            }}
                            items={items}
                        />
                    </div>
                </div>
                <div> {children} </div>
            </PageContainer>
        </div>
    );
}
