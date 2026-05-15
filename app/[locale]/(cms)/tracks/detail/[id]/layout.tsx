'use client';
import AppHeaderPage from '@/components/ant-music/app-header-page';
import ItemHeaderPage from '@/components/ant-music/item-header-page';
import IconButton from '@/components/ui/button/icon-button';
import DetailSkeleton from '@/components/ui/skeleton/detail-skeleton';
import { SIZE_ICON_BIG } from '@/constants/common';
import { APP_ROUTES } from '@/enums/routes';
import { getTrackDetailRoute } from '@/modules/tracks/helpers/link';
import { Link } from '@/i18n/routing';
import AppError from '@/modules/auth/components/error';
import { RELEASE_COVER_ART_SIZE } from '@/modules/releases/constants';
import { TRACK_TABS } from '@/modules/tracks/enums';
import { useGetDetailTrack } from '@/modules/tracks/hooks/use-get-detail-tracks';
import { bucketApi } from '@/modules/upload/apis/bucket-api';
import { useGetLinkReadFile } from '@/modules/upload/hooks/use-get-link-read-file';
import { PageContainer } from '@ant-design/pro-components';
import { Tabs, TabsProps, theme } from 'antd';
import { Download } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useParams, usePathname } from 'next/navigation';
import { PropsWithChildren, useState } from 'react';

export default function TrackDetail({ children }: PropsWithChildren) {
    // hooks - state
    const messages = useTranslations();
    // const [activeTab, setActiveTab] = useState<string>(TRACK_TABS.METADATA);
    const { token } = theme.useToken();

    // params - router
    // const router = useRouter();
    const params = useParams();
    const trackId = params['id'];
    const pathname = usePathname();

    // apis
    const { trackData, isLoading, error } = useGetDetailTrack(
        trackId as string
    );
    const { linkReadFile, isFetching: imageFetching } = useGetLinkReadFile(
        trackData?.release?.coverArtThumbnails?.[RELEASE_COVER_ART_SIZE.S160] as string
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
    const trackName = trackArtist
        ?.map((item) => item?.artist?.name)
        ?.join(' & ');
    // const trackMainArtist = trackArtist?.find(
    //     (item) => item?.artistRole?.code === MAIN_ARTIST_ROLE
    // );
    // const featuringArtist = trackArtist?.filter(
    //     (item) => item.artistRole?.code === FEATURING_ARTIST_ROLE
    // );
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
    const lastSegment = pathname.split('/').pop();
    const breadcrumb = [
        {
            title: messages('common.tracks'),
            href: APP_ROUTES.TRACKS,
        },
        {
            title: trackData?.title,
        },
        {
            title:
                lastSegment === TRACK_TABS.METADATA ? 'Metadata' : 'Audio File',
        },
    ];

 
    if (error) {
        return <AppError error={error} />;
    }

    if (isLoading || !trackData) {
        return <DetailSkeleton />;
    }

    return (
        <div
            className="h-full min-h-[calc(100vh-64px)] overflow-auto"
            style={{ backgroundColor: token.colorBgLayout }}
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
                // className="mx-auto max-w-screen-2xl px-2"
                >
                    <div
                        className="sticky top-0 z-10 mb-4 rounded-lg px-4 py-2"
                        style={{
                            background: token.colorBgContainer,
                        }}
                    >
                        <AppHeaderPage
                            imageSrc={linkReadFile}
                            imageLoading={imageFetching}
                            isScrolled={false}
                            options={renderDownloadTrack()}
                        >
                            <ItemHeaderPage
                                name={messages('track.name')}
                                value={`${trackData.title} ${trackData.version && trackData.title && `[${trackData?.version}]`}`}
                            />

                            <ItemHeaderPage
                                name={messages('artist.label')}
                                value={`${trackName}`}
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

                            <ItemHeaderPage
                                name={'ISRC'}
                                value={trackData.isrc}
                            />
                        </AppHeaderPage>

                        <div>
                            <Tabs
                                className="!pt-0"
                                activeKey={lastSegment}
                                style={{
                                    backgroundColor: token.colorBgContainer,
                                }}
                                items={itemTabs}
                            />
                        </div>
                    </div>
                    <div className="flex-1"> {children} </div>
                </div>
            </PageContainer>
        </div>
    );
}
