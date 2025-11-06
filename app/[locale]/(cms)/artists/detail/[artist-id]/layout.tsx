'use client';
import AppHeaderPage from '@/components/ant-music/app-header-page';
import ItemHeaderPage from '@/components/ant-music/item-header-page';
import DetailSkeleton from '@/components/ui/skeleton/detail-skeleton';
import { APP_ROUTES } from '@/enums/routes';
import { Link, usePathname, useRouter } from '@/i18n/routing';
import { ARTIST_DETAIL_TABS } from '@/modules/artist/enum';
import { useGetDetailArtist } from '@/modules/artist/hooks/use-get-detail-artist';
import { PageContainer } from '@ant-design/pro-components';
import { Tabs, TabsProps, theme } from 'antd';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { PropsWithChildren, useRef, useState } from 'react';

export default function ArtistDetailLayout({ children }: PropsWithChildren) {
    console.log('🚀 ~ ArtistDetailLayout ~ children:', children);
    // hooks - state
    const { token } = theme.useToken();
    const [isScroll, setIsScrolled] = useState(false);
    const messages = useTranslations();
    const scrollContainerRef = useRef<HTMLDivElement>(null);

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
                    {messages('artist.label')}
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
    const isOverviewPage =
        pathname.split('/').pop() == ARTIST_DETAIL_TABS.OVERVIEW;
    const tabKey = pathname.split('/').pop();

    // apis
    const { artistData, isLoading } = useGetDetailArtist(artistId as string);

    const lastSegment = pathname.split('/').pop();
    const breadcrumb = [
        {
            title: messages('artist.label'),
            href: APP_ROUTES.ARTISTS,
        },
        {
            title: artistData?.name || '',
        },
        {
            title:
                lastSegment === ARTIST_DETAIL_TABS.OVERVIEW
                    ? messages('artist.label')
                    : lastSegment === ARTIST_DETAIL_TABS.RELEASES
                      ? messages('release.releases')
                      : lastSegment === ARTIST_DETAIL_TABS.TRACKS
                        ? messages('common.tracks')
                        : '',
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

    if (isLoading || !artistData) {
        return <DetailSkeleton />;
    }

    return (
        <div
            className="h-full overflow-auto"
            style={{
                background: token.colorBgLayout,
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
