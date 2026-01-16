'use client';
import AppHeaderPage from '@/components/ant-music/app-header-page';
import ItemHeaderPage from '@/components/ant-music/item-header-page';
import DetailSkeleton from '@/components/ui/skeleton/detail-skeleton';
import { APP_ROUTES } from '@/enums/routes';
import { Link, usePathname } from '@/i18n/routing';
import AppError from '@/modules/auth/components/error';
import { LABEL_DETAIL_TABS } from '@/modules/labels/enum';
import { useGetDetailLabel } from '@/modules/labels/hooks/use-get-detail-label';
import { useLabelContext } from '@/modules/labels/hooks/use-label-context';
import { PageContainer } from '@ant-design/pro-components';
import { Tabs, TabsProps, theme } from 'antd';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { PropsWithChildren, useEffect, useRef, useState } from 'react';

export default function LabelDetailLayout({ children }: PropsWithChildren) {
    // Hooks - state
    const messages = useTranslations();
    const headerLayoutRef = useRef<HTMLDivElement>(null);
    const { setHeaderLayoutHeight } = useLabelContext();
    const { token } = theme.useToken();
    const [isScrolled, setIsScrolled] = useState(false);

    // Router - params
    const params = useParams();
    const labelId = params['label-id'];
    const pathname = usePathname();

    // Apis
    const { labelData, isLoading, error } = useGetDetailLabel(
        labelId as string
    );

    // Const
    const items: TabsProps['items'] = [
        {
            key: LABEL_DETAIL_TABS.OVERVIEW,
            label: (
                <Link className="font-medium" href={`overview`}>
                    {messages('common.overview')}
                </Link>
            ),
        },
        {
            key: LABEL_DETAIL_TABS.RELEASES,
            label: (
                <Link className="font-medium" href={LABEL_DETAIL_TABS.RELEASES}>
                    {messages('release.releases')}
                </Link>
            ),
        },
        {
            key: LABEL_DETAIL_TABS.TRACKS,
            label: (
                <Link className="font-medium" href={LABEL_DETAIL_TABS.TRACKS}>
                    {messages('common.tracks')}
                </Link>
            ),
        },
    ];

    const lastSegment = pathname?.split('/').pop();
    const currentTab = items?.find((item) => item?.key === lastSegment);
    const breadcrumb = [
        { title: messages('label.labels'), href: APP_ROUTES.LABELS },
        { title: labelData?.name || '' },
        {
            title: currentTab?.label,
        },
    ];

    const tabKey = pathname.split('/').pop();
    // const isOverviewPage = tabKey == LABEL_DETAIL_TABS.OVERVIEW;

    const handleOnScroll = (e: React.UIEvent<HTMLDivElement>) => {
        if (currentTab?.key == LABEL_DETAIL_TABS.OVERVIEW) return setIsScrolled(false);
        setIsScrolled(e.currentTarget.scrollTop > 50);
    };

    useEffect(() => {
        if (headerLayoutRef.current && labelData) {
            const height =
                headerLayoutRef.current.getBoundingClientRect().height;
            setHeaderLayoutHeight(height);
        }
    }, [labelData.id]);

    if (error) {
        return <AppError error={error} />;
    }

    if (isLoading || !labelData) {
        return <DetailSkeleton />;
    }

    return (
        <div
            className="h-full min-h-[calc(100vh-64px)] overflow-auto"
            style={{ backgroundColor: token.colorBgLayout }}
            onScroll={handleOnScroll}
        >
            <PageContainer
                title={false}
                header={{ breadcrumb: { items: breadcrumb } }}
            >
                <div
                    ref={headerLayoutRef}
                    className="sticky top-0 z-10 mb-4 rounded-lg px-4 py-2"
                    style={{
                        background: token.colorBgContainer,
                    }}
                >
                    <AppHeaderPage
                        imageSrc={labelData?.picture as string}
                        isScrolled={isScrolled}
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
