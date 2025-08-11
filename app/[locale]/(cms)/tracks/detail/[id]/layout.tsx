'use client';
import AppHeaderPage from '@/components/ant-music/app-header-page';
import ItemHeaderPage from '@/components/ant-music/item-header-page';
import IconButton from '@/components/ui/button/icon-button';
import { SIZE_ICON_BIG } from '@/constants/common';
import { getTrackDetailRoute } from '@/helpers/link';
import { useRouter } from '@/i18n/routing';
import {
    FEATURING_ARTIST_ROLE,
    MAIN_ARTIST_ROLE,
} from '@/modules/release-artist/constants';
import { TRACK_TABS } from '@/modules/tracks/enums';
import { useGetDetailTrack } from '@/modules/tracks/hooks/use-get-detail-tracks';
import { bucketApi } from '@/modules/upload/apis/bucket-api';
import { useGetLinkReadFile } from '@/modules/upload/hooks/use-get-link-read-file';
import { Tabs, TabsProps, theme } from 'antd';
import { Download } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useParams, usePathname } from 'next/navigation';
import { PropsWithChildren, useEffect, useRef, useState } from 'react';

export default function TrackDetail({ children }: PropsWithChildren) {
    // hooks - state
    const messages = useTranslations();
    const [isScroll, setIsScrolled] = useState(false);
    const [activeTab, setActiveTab] = useState<string>(TRACK_TABS.METADATA);
    const { token } = theme.useToken();
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    // params - router
    const router = useRouter();
    const params = useParams();
    const trackId = params['id'];
    const pathname = usePathname();

    // apis
    const { trackData } = useGetDetailTrack(trackId as string);
    const { linkReadFile } = useGetLinkReadFile(
        trackData?.release?.coverArtThumbnails?.['160x160'] as string
    );

    // const
    const itemTabs: TabsProps['items'] = [
        {
            key: TRACK_TABS.METADATA,
            label: 'Metadata',
        },
        {
            key: TRACK_TABS.AUDIO_FILE,
            label: 'Audio File',
        },
    ];
    const trackArtist = trackData?.trackArtists;
    const trackMainArtist = trackArtist?.find(
        (item) => item?.artistRole?.value === MAIN_ARTIST_ROLE
    );
    const featuringArtist = trackArtist?.filter(
        (item) => item.artistRole?.value === FEATURING_ARTIST_ROLE
    );
    const renderDownloadTrack = () => {
        const handleOnclick = async () => {
            const response = await bucketApi.getLinkDownloadFile(
                trackData?.audioFile?.fileId as string
            );
            if (!response?.data?.data) return;
            window.open(response?.data?.data);
        };
        return (
            <div>
                <IconButton onClick={handleOnclick}>
                    <Download size={SIZE_ICON_BIG} />
                </IconButton>
            </div>
        );
    };

    // func
    const handleTabChange = (key: string) => {
        router.push(getTrackDetailRoute(trackData?.id, key as TRACK_TABS));
    };

    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = scrollContainerRef.current?.scrollTop || 0;

            setIsScrolled(scrollTop > 0);
        };
        const scrollEl = scrollContainerRef.current;
        console.log(isScroll);

        if (scrollEl) {
            scrollEl.addEventListener('scroll', handleScroll);
        }
        return () => {
            if (scrollEl) {
                scrollEl.removeEventListener('scroll', handleScroll);
            }
        };
    }, []);

    useEffect(() => {
        const getActiveTab = () => {
            const map: Record<string, string> = {
                [TRACK_TABS.METADATA]: TRACK_TABS.METADATA,
                [TRACK_TABS.AUDIO_FILE]: TRACK_TABS.AUDIO_FILE,
            };
            const tabKey = pathname.split('/').pop();
            return map[tabKey ?? ''] || TRACK_TABS.METADATA;
        };
        setActiveTab(getActiveTab());
    }, [pathname]);

    return (
        <div
            className="h-[calc(100vh-4rem)] overflow-y-auto"
            ref={scrollContainerRef}
        >
            <div className="sticky top-0 z-10">
                <AppHeaderPage
                    imageSrc={linkReadFile}
                    isScrolled={isScroll}
                    options={renderDownloadTrack()}
                >
                    <ItemHeaderPage
                        name={messages('tracks.name')}
                        value={`${trackData.title} ${trackData.version && trackData.title && `[${trackData?.version}]`}`}
                    />

                    <ItemHeaderPage
                        name={messages('artist.label')}
                        value={`${trackMainArtist?.artist?.name ?? ''} ${featuringArtist && featuringArtist?.length > 0 ? `feat. ${featuringArtist.map((item) => item.artist?.name).join(' & ')}` : ''}`}
                    />

                    <ItemHeaderPage
                        name={messages('common.genres')}
                        value={trackData?.primaryGenre?.name}
                    />

                    <ItemHeaderPage
                        name={messages('labels.label')}
                        value={trackData?.release?.label?.name}
                    />

                    <ItemHeaderPage
                        name={messages('releases.label')}
                        value={trackData?.release?.title}
                    />

                    <ItemHeaderPage name={'ISRC'} value={trackData.isrc} />
                </AppHeaderPage>

                <div className="px-4">
                    <Tabs
                        className="!pt-0"
                        style={{
                            backgroundColor: token.colorBgContainer,
                        }}
                        items={itemTabs}
                        onChange={handleTabChange}
                    />
                </div>
            </div>
            <div className="flex-1"> {children} </div>
        </div>
    );
}
