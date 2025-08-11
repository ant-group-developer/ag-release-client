'use client';
import AppHeaderPage from '@/components/ant-music/app-header-page';
import ItemHeaderPage from '@/components/ant-music/item-header-page';
import { Link, usePathname, useRouter } from '@/i18n/routing';
import { ARTIST_DETAIL_TABS } from '@/modules/artist/enum';
import { useGetDetailArtist } from '@/modules/artist/hooks/use-get-detail-artist';
import { Tabs, TabsProps } from 'antd';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { PropsWithChildren, useEffect, useRef, useState } from 'react';

export default function ArtistDetailLayout({ children }: PropsWithChildren) {
    // hooks - state
    const [activeTab, setActiveTab] = useState<string>(
        ARTIST_DETAIL_TABS.OVERVIEW
    );
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

    // apis
    const { artistData } = useGetDetailArtist(artistId as string);

    useEffect(() => {
        const getActiveTab = () => {
            const map: Record<string, string> = {
                [ARTIST_DETAIL_TABS.OVERVIEW]: ARTIST_DETAIL_TABS.OVERVIEW,
                [ARTIST_DETAIL_TABS.RELEASES]: ARTIST_DETAIL_TABS.RELEASES,
                [ARTIST_DETAIL_TABS.TRACKS]: ARTIST_DETAIL_TABS.TRACKS,
            };
            const tabKey = pathname.split('/').pop();
            return map[tabKey ?? ''] || ARTIST_DETAIL_TABS.OVERVIEW;
        };
        setActiveTab(getActiveTab());
    }, [pathname]);

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

    return (
        <div
            className="h-[calc(100vh-4rem)] overflow-y-auto"
            ref={scrollContainerRef}
        >
            <div className="sticky top-0 z-10">
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
                        activeKey={activeTab}
                        className="tab-release-detail"
                        items={items}
                        // tabBarExtraContent={{
                        //     right: (
                        //         <div className="pr-4">
                        //             <Button
                        //                 shape="round"
                        //                 onClick={() => {
                        //                     router.push('/artists');
                        //                 }}
                        //             >
                        //                 <ChevronLeft size={SIZE_ICON} />
                        //                 Danh sách nghệ sĩ
                        //             </Button>
                        //         </div>
                        //     ),
                        // }}
                    />
                </div>
            </div>
            <div>{children}</div>
        </div>
    );
}
