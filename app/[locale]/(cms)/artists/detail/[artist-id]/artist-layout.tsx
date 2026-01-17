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
    const [isScrolled, setIsScrolled] = useState(false);

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

    const handleOnScroll = (e: React.UIEvent<HTMLDivElement>) => {
        if (currentTab?.key == ARTIST_DETAIL_TABS.OVERVIEW) return setIsScrolled(false);
            setIsScrolled(e.currentTarget.scrollTop > 50);
    };

    if (isLoading || !artistData) {
        return <DetailSkeleton />;
    }

    return (
        <div
            className="h-full w-full min-w-0 overflow-auto"
            style={{
                background: token.colorBgLayout,
            }}
            onScroll={handleOnScroll}
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
                >
                    <AppHeaderPage
                        imageSrc={artistData?.picture as string}
                        isScrolled={isScrolled}
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
