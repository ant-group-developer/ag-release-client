'use client';
import DetailSkeleton from '@/components/ui/skeleton/detail-skeleton';
import { APP_ROUTES } from '@/enums/routes';
import { cn } from '@/helpers/common';
import { RELEASE_DETAIL_ACTION } from '@/helpers/link';
import { useGetReleaseDetailRoute } from '@/hooks/use-get-release-detail-route';
import useModalStore from '@/hooks/use-modal';
import { useReleaseActionStore } from '@/hooks/use-release-action-store';
import { Link } from '@/i18n/routing';
import AppError from '@/modules/auth/components/error';
import ReleaseDetailHeader from '@/modules/releases/components/release-detail/header';
import RightSidebar from '@/modules/releases/components/release-detail/right-sidebar';
import { RELEASES_TABS, TYPE_MODAL_RELEASE } from '@/modules/releases/enums';
import {
    ReleaseFormStoreData,
    useReleaseFormStore,
} from '@/modules/releases/hooks/release-form-store';
import { useGetDetailRelease } from '@/modules/releases/hooks/use-get-detail-release';
import { useGetListTracks } from '@/modules/tracks/hooks/use-get-list-tracks';
import { Breadcrumb, Button, Tabs, TabsProps, theme } from 'antd';
import { useTranslations } from 'next-intl';
import { useParams, usePathname } from 'next/navigation';
import { PropsWithChildren, useEffect, useRef, useState } from 'react';

type Props = {};

export default function ReleaseDetail({ children }: PropsWithChildren) {
    // hooks
    const messages = useTranslations();
    const params = useParams();
    const setFormValues = useReleaseFormStore((state) => state.setFormValues);
    // const formValues = useReleaseFormStore((state) => state.formValues);
    const pathname = usePathname();
    const openModal = useModalStore((state) => state.openModal);
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const resetFormValues = useReleaseFormStore(
        (state) => state.resetFormValues
    );
    const { token } = theme.useToken();
    const { getReleaseTabRoute } = useGetReleaseDetailRoute();
    const releaseAction = useReleaseActionStore((s) => s.action);

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
        : getReleaseTabRoute(releaseId, RELEASES_TABS.CORE_DETAIL);
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
                    href={getReleaseTabRoute(releaseId, RELEASES_TABS.TRACKS)}
                >
                    <span className="font-medium">
                        {messages('common.tracks')}
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
                    href={getReleaseTabRoute(releaseId, RELEASES_TABS.SCHEDULE)}
                >
                    <span className="font-medium">
                        {messages('release.scheduling.label')}
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
                    href={getReleaseTabRoute(
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
                    href={getReleaseTabRoute(releaseId, RELEASES_TABS.REVIEW)}
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
    const {
        releaseData,
        isLoading: isReleaseDataLoading,
        error,
    } = useGetDetailRelease(releaseId);
    const { tracksData, isLoading: isTracksLoading } = useGetListTracks({
        releaseId: releaseData?.id || '',
        fieldOrder: 'order',
    });

    // render
    const isShowAddTrack =
        tracksData?.items?.length < releaseData?.albumFormat?.maxTrackCount &&
        releaseAction == RELEASE_DETAIL_ACTION.EDIT;
    const extraButton = (
        <div className="flex justify-end gap-2">
            {isTracksPage && isShowAddTrack && (
                <Button
                    onClick={() => openModal(TYPE_MODAL_RELEASE.ADD_TRACK)}
                    type="primary"
                >
                    {messages('track.add')}
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
        };

        if (releaseId && releaseData?.id) {
            setFormValues(initialData);
        }
    }, [releaseId, releaseData?.id]);

    useEffect(() => {
        // Chỉ theo dõi scroll khi ở trang core-detail, các trang khác mặc định isScrolled = true
        if (!isCoreDetailPage) {
            setIsScrolled(true);
            return;
        }
        const el = document.getElementById('layout-scroll');

        // Lắng nghe scroll để set isScrolled chỉ khi ở trang core-detail
        const handleScroll = () => {
            setIsScrolled(el!.scrollTop > 0);
        };
        if (el) {
            el.addEventListener('scroll', handleScroll);
        }
        return () => {
            if (el) {
                el.removeEventListener('scroll', handleScroll);
            }
        };
    }, [isCoreDetailPage]);

    const currentItem = items.find((item) => item.key === activeTab);
    const breadcrumbItems = [
        {
            title: messages('release.releases'),
            href: APP_ROUTES.RELEASES,
        },
        {
            title: releaseData?.title || messages('common.create'),
        },
        {
            title: currentItem?.label,
        },
    ];

    if (error) {
        return <AppError error={error} />;
    }

    return (
        <div
            className="flex h-full overflow-x-clip"
            style={{ backgroundColor: token.colorBgLayout }}
            ref={scrollContainerRef}
        >
            {isReleaseDataLoading || !releaseData ? (
                <div className="w-[100vw] px-8">
                    <DetailSkeleton />
                </div>
            ) : (
                <div className="mx-auto flex min-w-0 flex-1 flex-col px-8">
                    <Breadcrumb items={breadcrumbItems} className="!py-4" />
                    <div
                        className="sticky top-0 z-10 mb-4 rounded-lg p-4"
                        style={{
                            backgroundColor: token.colorBgContainer,
                        }}
                    >
                        <ReleaseDetailHeader isScrolled={isScrolled} />
                        <div>
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
                    <div>{children}</div>
                </div>
            )}
            <RightSidebar />
        </div>
    );
}
