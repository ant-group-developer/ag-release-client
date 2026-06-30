'use client';
import DetailSkeleton from '@/components/ui/skeleton/detail-skeleton';
import { SIZE_ICON } from '@/constants/common';
import { PAGE_SIZE_EXTRA_LARGE } from '@/constants/page-size';
import { APP_ROUTES, PATH_PARAMS } from '@/enums/routes';
import { cn } from '@/helpers/common';
import { useGetReleaseDetailRoute } from '@/hooks/use-get-release-detail-route';
import { usePermission } from '@/hooks/use-permission';
import { useReleaseActionStore } from '@/hooks/use-release-action-store';
import { Link } from '@/i18n/routing';
import AppError from '@/modules/auth/components/error';
import { PERMISSION } from '@/modules/auth/constants/permission';
import { useAuth } from '@/modules/auth/hooks/use-auth';
import { useReleaseDistribute } from '@/modules/distribution/hooks/use-release-distribute';
import { useGetListReleaseDsp } from '@/modules/release-dsp/hooks/use-get-list-release-dsp';
import ReleaseDetailHeader from '@/modules/releases/components/release-detail/header';
import RightSidebar from '@/modules/releases/components/release-detail/right-sidebar';
import { RELEASE_ROUTE_ACTION, RELEASES_STATUS, RELEASES_TABS } from '@/modules/releases/enums';
import { RELEASE_DETAIL_ACTION } from '@/modules/releases/helpers/link';
import {
    ReleaseFormStoreData,
    useReleaseFormStore,
} from '@/modules/releases/hooks/release-form-store';
import { useGetDetailRelease } from '@/modules/releases/hooks/use-get-detail-release';
import { Breadcrumb, BreadcrumbProps, Tabs, TabsProps, theme } from 'antd';
import {
    BookHeadphones,
    Box,
    Calendar,
    ChartColumn,
    Eye,
    Music,
    ScrollText,
    ShieldCheck,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useParams, usePathname } from 'next/navigation';
import { PropsWithChildren, useEffect, useState } from 'react';

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
    const setReleaseAction = useReleaseActionStore((state) => state.setAction);
    const setLastPathAction = useReleaseActionStore((s) => s.setLastPathAction);
    const lastPathAction = useReleaseActionStore((s) => s.lastPathAction);
    const setLastReleaseId = useReleaseActionStore((s) => s.setLastReleaseId);
    const lastReleaseId = useReleaseActionStore((s) => s.lastReleaseId);
    const { hasPermission } = usePermission();
    const { isAdmin } = useAuth();

    // state
    const [activeTab, setActiveTab] = useState<string>(
        RELEASES_TABS.CORE_DETAIL
    );
    const [isScrolled, setIsScrolled] = useState(false);

    // const
    const releaseId = params[PATH_PARAMS.RELEASE_ID]
        ? `${params[PATH_PARAMS.RELEASE_ID]}`
        : '';
    const isCreateReleasePage =
        params[PATH_PARAMS.ACTION] === RELEASE_ROUTE_ACTION.CREATE;
    const isDisableTab = releaseId == '';

    const canUpdate = hasPermission(PERMISSION.RELEASE_AUDIO.UPDATE);
    const isDetailPage = pathname.includes(`/${RELEASES_TABS.CORE_DETAIL}`);
    // const isTracksPage = pathname.includes(`/${RELEASES_TABS.TRACKS}`);
    const coreDetailTabsNavigate = isCreateReleasePage
        ? APP_ROUTES.RELEASES_CREATE
        : getReleaseTabRoute(releaseId, RELEASES_TABS.CORE_DETAIL);

    // apis
    const {
        releaseData,
        isLoading: isReleaseDataLoading,
        error,
    } = useGetDetailRelease(releaseId);

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
            key: RELEASES_TABS.ANALYTICS,
            label: (
                <Link
                    className={cn(isDisableTab ? 'pointer-events-none' : '')}
                    href={getReleaseTabRoute(
                        releaseId,
                        RELEASES_TABS.ANALYTICS
                    )}
                >
                    <div className="flex items-center gap-1">
                        <ChartColumn size={SIZE_ICON} />
                        <span>{messages('analytics.label')}</span>
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
        ...(isAdmin && !isCreateReleasePage
            ? [
                  {
                      key: RELEASES_TABS.SUBMITS,
                      label: (
                          <Link
                              className={cn(
                                  isDisableTab ? 'pointer-events-none' : ''
                              )}
                              href={getReleaseTabRoute(
                                  releaseId,
                                  RELEASES_TABS.SUBMITS
                              )}
                          >
                              <div className="flex items-center gap-1">
                                  <ScrollText size={SIZE_ICON} />
                                  <span>
                                      {messages('releaseVideo.tabs.submits')}
                                  </span>
                              </div>
                          </Link>
                      ),
                      disabled: isDisableTab,
                  },
                  ...(releaseData?.status !== RELEASES_STATUS.DRAFT
                      ? [
                            {
                                key: RELEASES_TABS.SYSTEM_REVIEW,
                                label: (
                                    <Link
                                        className={cn(
                                            isDisableTab ? 'pointer-events-none' : ''
                                        )}
                                        href={getReleaseTabRoute(
                                            releaseId,
                                            RELEASES_TABS.SYSTEM_REVIEW
                                        )}
                                    >
                                        <div className="flex items-center gap-1">
                                            <ShieldCheck size={SIZE_ICON} />
                                            <span>
                                                {messages('common.systemReview')}
                                            </span>
                                        </div>
                                    </Link>
                                ),
                                disabled: isDisableTab,
                            },
                        ]
                      : []),
              ]
            : []),
    ];

    useEffect(() => {
        const getActiveTab = () => {
            const map: Record<string, string> = {
                [RELEASES_TABS.CORE_DETAIL]: RELEASES_TABS.CORE_DETAIL,
                [RELEASES_TABS.TRACKS]: RELEASES_TABS.TRACKS,
                [RELEASES_TABS.SCHEDULE]: RELEASES_TABS.SCHEDULE,
                [RELEASES_TABS.DISTRIBUTION]: RELEASES_TABS.DISTRIBUTION,
                [RELEASES_TABS.ANALYTICS]: RELEASES_TABS.ANALYTICS,
                [RELEASES_TABS.REVIEW]: RELEASES_TABS.REVIEW,
                [RELEASES_TABS.SUBMITS]: RELEASES_TABS.SUBMITS,
                [RELEASES_TABS.SYSTEM_REVIEW]: RELEASES_TABS.SYSTEM_REVIEW,
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

        const initialData: ReleaseFormStoreData = {
            ...releaseData,
        };
        if (releaseId && releaseData?.id) {
            setFormValues(initialData);
        }
    }, [releaseId, releaseData?.id]);

    // selective reset based on navigation transition and permissions
    useEffect(() => {
        if (
            params[PATH_PARAMS.ACTION] === RELEASE_ROUTE_ACTION.DETAIL &&
            releaseId
        ) {
            // Force READ if user doesn't have update permission
            if (!canUpdate) {
                setReleaseAction(RELEASE_DETAIL_ACTION.READ);
            }
            // Case 1: Just transitioned from create to detail (after successful creation)
            else if (lastPathAction === RELEASE_ROUTE_ACTION.CREATE) {
                setReleaseAction(RELEASE_DETAIL_ACTION.EDIT);
            }
            // Case 2: Entered from elsewhere, basic switch releases, or first entry in session
            else if (releaseId !== lastReleaseId) {
                setReleaseAction(RELEASE_DETAIL_ACTION.READ);
            }
        }

        // Update store for next mount/change
        setLastPathAction(params[PATH_PARAMS.ACTION] as string);
        setLastReleaseId(releaseId);
    }, [
        params[PATH_PARAMS.ACTION],
        releaseId,
        setReleaseAction,
        canUpdate,
        lastPathAction,
        lastReleaseId,
        setLastPathAction,
        setLastReleaseId,
    ]);

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const scrollTop = e.currentTarget.scrollTop;
        if (!isScrolled && scrollTop > 150) {
            setIsScrolled(true);
        } else if (isScrolled && scrollTop <= 10) {
            setIsScrolled(false);
        }
    };

    const currentItem = items.find((item) => item.key === activeTab);
    const breadcrumbItems: BreadcrumbProps['items'] = [
        {
            title: (
                <Link href={APP_ROUTES.RELEASES}>
                    {messages('release.releases')}
                </Link>
            ),
        },
        {
            title: releaseData?.title || messages('common.create'),
        },
        {
            title: currentItem?.label,
        },
    ];

    const setSelectedRow = useReleaseDistribute(
        (state) => state.setSelectedRows
    );
    const { releaseDsp } = useGetListReleaseDsp(releaseId, {
        page: 1,
        pageSize: PAGE_SIZE_EXTRA_LARGE,
    });

    useEffect(() => {
        setSelectedRow(
            releaseDsp?.items?.filter((item) => item.isSelected) ?? []
        );
    }, [releaseDsp, setSelectedRow]);

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
            className="flex flex-1 overflow-y-hidden overflow-x-clip"
            style={{ backgroundColor: token.colorBgLayout }}
        >
            <div
                onScroll={handleScroll}
                className="thin-scrollbar mx-auto flex h-[calc(100vh-4rem)] min-w-0 flex-1 flex-col overflow-y-auto px-8"
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
