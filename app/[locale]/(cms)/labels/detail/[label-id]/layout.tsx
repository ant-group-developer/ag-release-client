'use client';
import AppHeaderPage from '@/components/ant-music/app-header-page';
import ItemHeaderPage from '@/components/ant-music/item-header-page';
import DetailSkeleton from '@/components/ui/skeleton/detail-skeleton';
import { SIZE_ICON_SMALL } from '@/constants/common';
import { APP_ROUTES } from '@/enums/routes';
import { Link, usePathname, useRouter } from '@/i18n/routing';
import { LABEL_DETAIL_TABS } from '@/modules/labels/enum';
import { useGetDetailLabel } from '@/modules/labels/hooks/use-get-detail-label';
import { Tabs, TabsProps, theme } from 'antd';
import { ArrowLeft } from 'lucide-react';
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
    const { labelData, isLoading } = useGetDetailLabel(labelId as string);

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
                <Link
                    className="pl-4 font-medium"
                    href={LABEL_DETAIL_TABS.RELEASES}
                >
                    {messages('releases.label')}
                </Link>
            ),
        },
        {
            key: LABEL_DETAIL_TABS.TRACKS,
            label: (
                <Link className="font-medium" href={LABEL_DETAIL_TABS.TRACKS}>
                    {messages('tracks.label')}
                </Link>
            ),
        },
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

    if (isLoading || !labelData) {
        return <DetailSkeleton />;
    }

    return (
        <div className="mx-auto max-w-screen-2xl px-2" ref={scrollContainerRef}>
            <div
                className="sticky top-0 z-10"
                style={{
                    background: token.colorBgContainer,
                }}
            >
                <Link
                    href={APP_ROUTES.LABELS}
                    className="flex w-fit items-center gap-1 py-2 hover:underline"
                >
                    <ArrowLeft size={SIZE_ICON_SMALL} />
                    {messages('labels.back')}
                </Link>
                <AppHeaderPage
                    imageSrc={labelData?.picture as string}
                    isScrolled={isScroll}
                >
                    <ItemHeaderPage
                        name={messages('labels.label')}
                        value={labelData?.name}
                    />
                    <ItemHeaderPage
                        name={messages('releases.count')}
                        value={labelData?.releaseCount?.toString()}
                    />
                    <ItemHeaderPage
                        name={messages('tracks.count')}
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
        </div>
    );
}
