'use client';
import DetailSkeleton from '@/components/ui/skeleton/detail-skeleton';
import { SIZE_ICON } from '@/constants/common';
import { APP_ROUTES } from '@/enums/routes';
import { cn } from '@/helpers/common';
import { useGetReleaseDetailRoute } from '@/hooks/use-get-release-detail-route';
import { Link } from '@/i18n/routing';
import AppError from '@/modules/auth/components/error';
import ReleaseDetailHeader from '@/modules/releases/components/release-detail/header';
import RightSidebar from '@/modules/releases/components/release-detail/right-sidebar';
import { RELEASES_TABS } from '@/modules/releases/enums';
import {
    ReleaseFormStoreData,
    useReleaseFormStore,
} from '@/modules/releases/hooks/release-form-store';
import { useGetDetailRelease } from '@/modules/releases/hooks/use-get-detail-release';
import { Breadcrumb, Tabs, TabsProps, theme } from 'antd';
import { BookHeadphones, Box, Calendar, Eye, Music } from 'lucide-react';
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
    // const openModal = useModalStore((state) => state.openModal);
    const resetFormValues = useReleaseFormStore(
        (state) => state.resetFormValues
    );
    const { token } = theme.useToken();
    const { getReleaseTabRoute } = useGetReleaseDetailRoute();
    // const releaseAction = useReleaseActionStore((s) => s.action);

    // state
    const [activeTab, setActiveTab] = useState<string>(
        RELEASES_TABS.CORE_DETAIL
    );
    const [isScrolled, setIsScrolled] = useState(false);
    const scrollLockRef = useRef(false);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    // const
    const releaseId = params['release-id'] ? `${params['release-id']}` : '';
    const isCreateReleasePage = params['action'] === 'create';
    const isDisableTab = releaseId == '';
    const isDetailPage = pathname.includes(`/${RELEASES_TABS.CORE_DETAIL}`);
    // const isTracksPage = pathname.includes(`/${RELEASES_TABS.TRACKS}`);
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
                    <div className="flex items-center gap-1">
                        <BookHeadphones size={SIZE_ICON} />
                        <span>{messages('common.coreInfo')}</span>
                    </div>
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
                    <div className="flex items-center gap-1">
                        <Music size={SIZE_ICON} />
                        <span>{messages('common.tracks')}</span>
                    </div>
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
                    <div className="flex items-center gap-1">
                        <Calendar size={SIZE_ICON} />
                        <span>{messages('release.scheduling.label')}</span>
                    </div>
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
                    <div className="flex items-center gap-1">
                        <Box size={SIZE_ICON} />
                        <span>{messages('distribute.label')}</span>
                    </div>
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
                    <div className="flex items-center gap-1">
                        <Eye size={SIZE_ICON} />
                        <span>{messages('common.overview')}</span>
                    </div>
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

    // useEffect(() => {
    //     if (isCreateReleasePage) return setIsScrolled(false);
    //     // Chỉ theo dõi scroll khi ở trang core-detail, các trang khác mặc định isScrolled = true
    //     if (!isCoreDetailPage) {
    //         setIsScrolled(true);
    //         return;
    //     }
    // }, [isCoreDetailPage]);

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const scrollTop = e.currentTarget.scrollTop;
        if (!isScrolled && scrollTop > 100) {
            setIsScrolled(true);
        } else if (isScrolled && scrollTop <= 10) {
            setIsScrolled(false);
        }
    };

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

    if (isReleaseDataLoading || !releaseData) {
        return (
            <div className="w-full">
                <DetailSkeleton />
            </div>
        );
    }

    return (
        <div
            className="flex h-full overflow-x-clip"
            style={{ backgroundColor: token.colorBgLayout }}
        >
            <div
                onScroll={handleScroll}
                className="thin-scrollbar mx-auto flex min-w-0 flex-1 flex-col overflow-y-auto px-8"
            >
                <Breadcrumb items={breadcrumbItems} className="!py-4" />
                <div
                    id="release-header"
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
                            // tabBarExtraContent={extraButton}
                        />
                    </div>
                </div>
                <div>{children}</div>
            </div>
            <RightSidebar />
        </div>
    );
}
