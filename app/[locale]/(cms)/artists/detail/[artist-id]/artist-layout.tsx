'use client';
import AppHeaderPage from '@/components/ant-music/app-header-page';
import ItemHeaderPage from '@/components/ant-music/item-header-page';
import DetailSkeleton from '@/components/ui/skeleton/detail-skeleton';
import { APP_ROUTES } from '@/enums/routes';
import { Link, usePathname, useRouter } from '@/i18n/routing';
import { ARTIST_DETAIL_TABS } from '@/modules/artist/enum';
import { useArtistContext } from '@/modules/artist/hooks/use-artist-context';
import { useGetDetailArtist } from '@/modules/artist/hooks/use-get-detail-artist';
import { PageContainer } from '@ant-design/pro-components';
import { Tabs, TabsProps, theme } from 'antd';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { PropsWithChildren, useEffect, useRef, useState } from 'react';

export default function ArtistDetailLayout({ children }: PropsWithChildren) {
    // hooks - state
    const { token } = theme.useToken();
    const [isScroll, setIsScrolled] = useState(false);
    const messages = useTranslations();
    // const scrollContainerRef = useRef<HTMLDivElement>(null);
    const headerLayoutRef = useRef<HTMLDivElement>(null);
    const { setHeaderLayoutHeight } = useArtistContext();

    // router - params
    const params = useParams();
    const router = useRouter();
    const artistId = params['artist-id'];
    const pathname = usePathname();

    // const
    const items: TabsProps['items'] = [
        {
            key: ARTIST_DETAIL_TABS.OVERVIEW,
            label: (
                <Link
                    className="font-medium"
                    href={ARTIST_DETAIL_TABS.OVERVIEW}
                >
                    {messages('common.overview')}
                </Link>
            ),
        },
        {
            key: ARTIST_DETAIL_TABS.RELEASES,
            label: (
                <Link
                    className="font-medium"
                    href={ARTIST_DETAIL_TABS.RELEASES}
                >
                    {messages('release.releases')}
                </Link>
            ),
        },
        {
            key: ARTIST_DETAIL_TABS.TRACKS,
            label: (
                <Link className="font-medium" href={ARTIST_DETAIL_TABS.TRACKS}>
                    {messages('common.tracks')}
                </Link>
            ),
        },
    ];

    const tabKey = pathname.split('/').pop();

    // apis
    const { artistData, isLoading } = useGetDetailArtist(artistId as string);

    const currentTab = items?.find((item) => item?.key === tabKey);
    const breadcrumb = [
        {
            title: messages('artist.artists'),
            href: APP_ROUTES.ARTISTS,
        },
        {
            title: artistData?.name || '',
        },
        {
            title: currentTab?.label,
        },
    ];

    // useEffect(() => {
    //     if (!isOverviewPage) {
    //         setIsScrolled(true);
    //         return;
    //     } else {
    //         setIsScrolled(false);
    //     }
    //     const handleScroll = () => {
    //         const scrollTop = scrollContainerRef.current?.scrollTop || 0;

    //         setIsScrolled(scrollTop > 0);
    //     };
    //     const scrollEl = scrollContainerRef.current;

    //     if (scrollEl) {
    //         scrollEl.addEventListener('scroll', handleScroll);
    //     }
    //     return () => {
    //         if (scrollEl) {
    //             scrollEl.removeEventListener('scroll', handleScroll);
    //         }
    //     };
    // }, [pathname, isOverviewPage]);

    useEffect(() => {
        if (headerLayoutRef.current && artistData) {
            const height =
                headerLayoutRef.current.getBoundingClientRect().height;
            setHeaderLayoutHeight(height);
        }
    }, [artistData.id, isScroll]);

    if (isLoading || !artistData) {
        return <DetailSkeleton />;
    }

    return (
        <div
            className="h-full overflow-auto"
            style={{
                background: token.colorBgLayout,
            }}
            onScroll={(e) => {
                const el = e.currentTarget;
                setIsScrolled(el.scrollTop > 0);
            }}
        >
            <PageContainer
                title={false}
                header={{
                    breadcrumb: {
                        items: breadcrumb,
                    },
                }}
            >
                <div
                    ref={headerLayoutRef}
                    className="sticky top-0 z-10 rounded-lg px-4 py-2"
                    style={{
                        background: token.colorBgContainer,
                    }}
                    onScroll={(e) => {
                        const scrollTop =
                            (e.target as HTMLDivElement).scrollTop || 0;
                        setIsScrolled(scrollTop > 0);
                    }}
                >
                    <AppHeaderPage
                        imageSrc={artistData?.picture as string}
                        isScrolled={isScroll}
                    >
                        <ItemHeaderPage
                            name={messages('artist.name')}
                            value={artistData.name}
                        />
                        <ItemHeaderPage
                            name={messages('release.label')}
                            value={artistData?.releaseCount?.toString()}
                        />
                        <ItemHeaderPage
                            name={messages('track.label')}
                            value={artistData?.trackCount?.toString()}
                        />
                    </AppHeaderPage>
                    <div>
                        <Tabs
                            activeKey={tabKey}
                            className="tab-release-detail"
                            items={items}
                        />
                    </div>
                </div>
                <div>{children}</div>
            </PageContainer>
        </div>
    );
}
