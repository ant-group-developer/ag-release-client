'use client';
import AppHeaderPage from '@/components/ant-music/app-header-page';
import ItemHeaderPage from '@/components/ant-music/item-header-page';
import DetailSkeleton from '@/components/ui/skeleton/detail-skeleton';
import { SIZE_ICON_SMALL } from '@/constants/common';
import { APP_ROUTES } from '@/enums/routes';
import { Link, usePathname, useRouter } from '@/i18n/routing';
import { ARTIST_DETAIL_TABS } from '@/modules/artist/enum';
import { useGetDetailArtist } from '@/modules/artist/hooks/use-get-detail-artist';
import { Tabs, TabsProps, theme } from 'antd';
import { ArrowLeft } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { PropsWithChildren, useEffect, useRef, useState } from 'react';

export default function ArtistDetailLayout({ children }: PropsWithChildren) {
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
                    className="pl-4 font-medium"
                    href={ARTIST_DETAIL_TABS.OVERVIEW}
                >
                    {messages('artist.profiles')}
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
                    {messages('releases.label')}
                </Link>
            ),
        },
        {
            key: ARTIST_DETAIL_TABS.TRACKS,
            label: (
                <Link className="font-medium" href={ARTIST_DETAIL_TABS.TRACKS}>
                    {messages('tracks.label')}
                </Link>
            ),
        },
    ];
    const isOverviewPage =
        pathname.split('/').pop() == ARTIST_DETAIL_TABS.OVERVIEW;
    const tabKey = pathname.split('/').pop();

    // apis
    const { artistData, isLoading } = useGetDetailArtist(artistId as string);

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
    }, [pathname, isOverviewPage]);

    if (isLoading || !artistData) {
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
                    href={APP_ROUTES.ARTISTS}
                    className="flex w-fit items-center gap-1 py-2 hover:underline"
                >
                    <ArrowLeft size={SIZE_ICON_SMALL} />
                    {messages('artist.back')}
                </Link>
                <AppHeaderPage
                    imageSrc={artistData?.picture as string}
                    isScrolled={isScroll}
                >
                    <ItemHeaderPage
                        name={messages('artist.name')}
                        value={artistData.name}
                    />
                    <ItemHeaderPage
                        name={messages('releases.count')}
                        value={artistData?.releaseCount?.toString()}
                    />
                    <ItemHeaderPage
                        name={messages('tracks.count')}
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
        </div>
    );
}
