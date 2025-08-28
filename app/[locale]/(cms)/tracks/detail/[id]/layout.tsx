'use client';
import AppHeaderPage from '@/components/ant-music/app-header-page';
import ItemHeaderPage from '@/components/ant-music/item-header-page';
import IconButton from '@/components/ui/button/icon-button';
import DetailSkeleton from '@/components/ui/skeleton/detail-skeleton';
import { SIZE_ICON_BIG, SIZE_ICON_SMALL } from '@/constants/common';
import { APP_ROUTES } from '@/enums/routes';
import { getTrackDetailRoute } from '@/helpers/link';
import { Link, useRouter } from '@/i18n/routing';
import AppError from '@/modules/auth/components/error';
import {
    FEATURING_ARTIST_ROLE,
    MAIN_ARTIST_ROLE,
} from '@/modules/release-artist/constants';
import { TRACK_TABS } from '@/modules/tracks/enums';
import { useGetDetailTrack } from '@/modules/tracks/hooks/use-get-detail-tracks';
import { bucketApi } from '@/modules/upload/apis/bucket-api';
import { useGetLinkReadFile } from '@/modules/upload/hooks/use-get-link-read-file';
import { Tabs, TabsProps, theme } from 'antd';
import { ArrowLeft, Download } from 'lucide-react';
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
    const { trackData, isLoading, error } = useGetDetailTrack(
        trackId as string
    );
    const { linkReadFile } = useGetLinkReadFile(
        trackData?.release?.coverArtThumbnails?.['160x160'] as string
    );

    // const
    const itemTabs: TabsProps['items'] = [
        {
            key: TRACK_TABS.METADATA,
            label: (
                <Link
                    href={getTrackDetailRoute(
                        trackData?.id,
                        TRACK_TABS.METADATA
                    )}
                >
                    Metadata
                </Link>
            ),
        },
        {
            key: TRACK_TABS.AUDIO_FILE,
            label: (
                <Link
                    href={getTrackDetailRoute(
                        trackData?.id,
                        TRACK_TABS.AUDIO_FILE
                    )}
                >
                    Audio File
                </Link>
            ),
        },
    ];
    const trackArtist = trackData?.trackArtists;
    const trackMainArtist = trackArtist?.find(
        (item) => item?.artistRole?.code === MAIN_ARTIST_ROLE
    );
    const featuringArtist = trackArtist?.filter(
        (item) => item.artistRole?.code === FEATURING_ARTIST_ROLE
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

    useEffect(() => {
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

    if (error) {
        return <AppError error={error} />;
    }

    if (isLoading || !trackData) {
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
                    href={APP_ROUTES.TRACKS}
                    className="flex w-fit items-center gap-1 py-2 hover:underline"
                >
                    <ArrowLeft size={SIZE_ICON_SMALL} />
                    {messages('track.back')}
                </Link>
                <AppHeaderPage
                    imageSrc={linkReadFile}
                    isScrolled={isScroll}
                    options={renderDownloadTrack()}
                >
                    <ItemHeaderPage
                        name={messages('track.name')}
                        value={`${trackData.title} ${trackData.version && trackData.title && `[${trackData?.version}]`}`}
                    />

                    <ItemHeaderPage
                        name={messages('artist.label')}
                        value={`${trackMainArtist?.artist?.name ?? ''} ${featuringArtist && featuringArtist?.length > 0 ? `(feat. ${featuringArtist.map((item) => item.artist?.name).join(' & ')}` : ''})`}
                    />

                    <ItemHeaderPage
                        name={messages('common.genres')}
                        value={trackData?.primaryGenre?.name}
                    />

                    <ItemHeaderPage
                        name={messages('label.label')}
                        value={trackData?.release?.label?.name}
                    />

                    <ItemHeaderPage
                        name={messages('release.label')}
                        value={trackData?.release?.title}
                    />

                    <ItemHeaderPage name={'ISRC'} value={trackData.isrc} />
                </AppHeaderPage>

                <div>
                    <Tabs
                        className="!pt-0"
                        style={{
                            backgroundColor: token.colorBgContainer,
                        }}
                        items={itemTabs}
                    />
                </div>
            </div>
            <div className="flex-1"> {children} </div>
        </div>
    );
}
