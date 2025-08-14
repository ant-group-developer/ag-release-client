'use client';
import { cn } from '@/helpers/common';
import {
    getReleaseDetailTabRoute,
    RELEASE_DETAIL_ACTION,
} from '@/helpers/link';
import useModalStore from '@/hooks/use-modal';
import { Link, useRouter } from '@/i18n/routing';
import ReleaseDetailHeader from '@/modules/releases/components/release-detail/header';
import RightSidebar from '@/modules/releases/components/release-detail/right-sidebar';
import { RELEASES_TABS, TYPE_MODAL_RELEASE } from '@/modules/releases/enums';
import {
    ReleaseFormStoreData,
    useReleaseFormStore,
} from '@/modules/releases/hooks/release-form-store';
import { useGetDetailRelease } from '@/modules/releases/hooks/use-get-detail-release';
import { useReleaseDetailActionStore } from '@/modules/releases/hooks/use-release-action-store';
import { useGetListTracks } from '@/modules/tracks/hooks/use-get-list-tracks';
import { Button, Tabs, TabsProps, theme } from 'antd';
import { useTranslations } from 'next-intl';
import { useParams, usePathname } from 'next/navigation';
import { PropsWithChildren, useEffect, useRef, useState } from 'react';

type Props = {};

export default function ReleaseDetail({ children }: PropsWithChildren) {
    // hooks
    const messages = useTranslations();
    const router = useRouter();
    const params = useParams();
    const setFormValues = useReleaseFormStore((state) => state.setFormValues);
    const formValues = useReleaseFormStore((state) => state.formValues);
    const pathname = usePathname();
    const openModal = useModalStore((state) => state.openModal);
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const resetFormValues = useReleaseFormStore(
        (state) => state.resetFormValues
    );
    const { token } = theme.useToken();
    const releaseDetailAction = useReleaseDetailActionStore(
        (state) => state.action
    );

    // state
    const [activeTab, setActiveTab] = useState<string>(
        RELEASES_TABS.CORE_DETAIL
    );
    const [isScrolled, setIsScrolled] = useState(false);

    // const
    const releaseId = params['release-id'] ? `${params['release-id']}` : '';
    const isCreateReleasePage = params['action'] === 'create';
    const isDisableTab = releaseId == '';
    const isDetailPage = pathname.includes(`/${RELEASES_TABS.CORE_DETAIL}`);
    const isTracksPage = pathname.includes(`/${RELEASES_TABS.TRACKS}`);
    const isCoreDetailPage = pathname.includes(`/${RELEASES_TABS.CORE_DETAIL}`);
    const coreDetailTabsNavigate = isCreateReleasePage
        ? '/releases/create'
        : getReleaseDetailTabRoute(releaseId, RELEASES_TABS.CORE_DETAIL);
    const items: TabsProps['items'] = [
        {
            key: RELEASES_TABS.CORE_DETAIL,
            label: (
                <Link
                    className={cn(
                        !isDisableTab || isCreateReleasePage
                            ? ''
                            : 'pointer-events-none'
                    )}
                    href={coreDetailTabsNavigate}
                >
                    <span className="font-medium">
                        {messages('common.coreInfo')}
                    </span>
                </Link>
            ),
            disabled: isDisableTab,
        },
        {
            key: RELEASES_TABS.TRACKS,
            label: (
                <Link
                    className={cn(
                        isDisableTab || isCreateReleasePage
                            ? 'pointer-events-none'
                            : ''
                    )}
                    href={getReleaseDetailTabRoute(
                        releaseId,
                        RELEASES_TABS.TRACKS
                    )}
                >
                    <span className="font-medium">
                        {messages('tracks.label')}
                    </span>
                </Link>
            ),
            disabled: isDisableTab,
        },
        {
            key: RELEASES_TABS.SCHEDULE,
            label: (
                <Link
                    className={cn(isDisableTab ? 'pointer-events-none' : '')}
                    href={getReleaseDetailTabRoute(
                        releaseId,
                        RELEASES_TABS.SCHEDULE
                    )}
                >
                    <span className="font-medium">
                        {messages('releases.scheduling.label')}
                    </span>
                </Link>
            ),
            disabled: isDisableTab,
        },
        {
            key: RELEASES_TABS.DISTRIBUTION,
            label: (
                <Link
                    className={cn(isDisableTab ? 'pointer-events-none' : '')}
                    href={getReleaseDetailTabRoute(
                        releaseId,
                        RELEASES_TABS.DISTRIBUTION
                    )}
                >
                    <span className="font-medium">
                        {messages('distribute.label')}
                    </span>
                </Link>
            ),
            disabled: isDisableTab,
        },
        {
            key: RELEASES_TABS.REVIEW,
            label: (
                <Link
                    className={cn(isDisableTab ? 'pointer-events-none' : '')}
                    href={getReleaseDetailTabRoute(
                        releaseId,
                        RELEASES_TABS.REVIEW
                    )}
                >
                    <span className="font-medium">
                        {messages('common.overview')}
                    </span>
                </Link>
            ),
            disabled: isDisableTab,
        },
    ];

    // apis
    const { releaseData, isLoading: isReleaseDataLoading } =
        useGetDetailRelease(releaseId);
    const { tracksData, isLoading: isTracksLoading } = useGetListTracks({
        releaseId: releaseData?.id || '',
    });

    // render
    const isShowAddTrack =
        tracksData?.items?.length < releaseData?.albumFormat?.maxTrackCount &&
        releaseDetailAction == RELEASE_DETAIL_ACTION.EDIT;
    const extraButton = (
        <div className="flex justify-end gap-2">
            {isTracksPage && isShowAddTrack && (
                <Button
                    onClick={() => openModal(TYPE_MODAL_RELEASE.ADD_TRACK)}
                    type="primary"
                >
                    {messages('tracks.add')}
                </Button>
            )}
        </div>
    );

    useEffect(() => {
        const getActiveTab = () => {
            const map: Record<string, string> = {
                [RELEASES_TABS.CORE_DETAIL]: RELEASES_TABS.CORE_DETAIL,
                [RELEASES_TABS.TRACKS]: RELEASES_TABS.TRACKS,
                [RELEASES_TABS.SCHEDULE]: RELEASES_TABS.SCHEDULE,
                [RELEASES_TABS.DISTRIBUTION]: RELEASES_TABS.DISTRIBUTION,
                [RELEASES_TABS.REVIEW]: RELEASES_TABS.REVIEW,
            };
            const tabKey = pathname.split('/').pop();
            return map[tabKey ?? ''] || RELEASES_TABS.CORE_DETAIL;
        };
        setActiveTab(getActiveTab());
    }, [pathname, isDetailPage]);

    useEffect(() => {
        if (!releaseId || releaseId === '' || isCreateReleasePage) {
            resetFormValues();
            return;
        }

        // ReleaseData from api into Release zustand global state
        const initialData: ReleaseFormStoreData = {
            ...releaseData,
            releaseLanguage: releaseData.releaseLanguage ?? {
                metadataLanguageId: '',
                audioLanguageId: '',
                metadataLanguageCountryId: '',
                releaseId: '',
            },
            releaseTerritory: releaseData.releaseTerritory ?? {
                distributeWorldwide: true,
            },
            tracks: tracksData.items.map((track) => ({
                ...track,
                isSensitiveContent: !!track.isSensitiveContent,
            })),
        };

        if (releaseId && releaseData?.id) {
            setFormValues(initialData);
        }
    }, [releaseId, JSON.stringify(releaseData), tracksData?.items]);

    useEffect(() => {
        // Chỉ theo dõi scroll khi ở trang core-detail, các trang khác mặc định isScrolled = true
        if (!isCoreDetailPage) {
            setIsScrolled(true);
            return;
        }

        // Lắng nghe scroll để set isScrolled chỉ khi ở trang core-detail
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
    }, [isCoreDetailPage]);

    return (
        <div className="flex h-full overflow-auto" ref={scrollContainerRef}>
            <div className="flex h-[calc(100vh-4rem)] flex-1 flex-col">
                <div className="sticky top-0 z-10">
                    <ReleaseDetailHeader isScrolled={isScrolled} />
                    <div className="px-4">
                        <Tabs
                            className="tab-release-detail !pt-0"
                            style={{
                                backgroundColor: token.colorBgContainer,
                            }}
                            items={items}
                            activeKey={activeTab}
                            tabBarExtraContent={extraButton}
                        />
                    </div>
                </div>
                <div className="flex-1">{children}</div>
            </div>
            <RightSidebar />
        </div>
    );
}
