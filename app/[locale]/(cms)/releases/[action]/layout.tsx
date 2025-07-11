'use client';
import { cn } from '@/helpers/common';
import { getReleaseDetailTabRoute } from '@/helpers/link';
import { showNotification } from '@/helpers/messages-helper';
import useModalStore from '@/hooks/use-modal';
import { Link, useRouter } from '@/i18n/routing';
import ReleaseDetailHeader from '@/modules/release-detail/header';
import RightSidebar from '@/modules/release-detail/right-sidebar';
import { RELEASES_TABS, TYPE_MODAL_RELEASE } from '@/modules/releases/enums';
import {
    ReleaseFormStoreData,
    useReleaseFormStore,
} from '@/modules/releases/hooks/release-form-store';
import { useGetDetailRelease } from '@/modules/releases/hooks/use-get-detail-release';
import { Button, Tabs, TabsProps } from 'antd';
import { useTranslations } from 'next-intl';
import { useParams, usePathname } from 'next/navigation';
import { PropsWithChildren, useEffect, useRef, useState } from 'react';

type Props = {};

export default function ReleaseDetail({ children }: PropsWithChildren) {
    const [activeTab, setActiveTab] = useState<string>(
        RELEASES_TABS.CORE_DETAIL
    );
    const [isScrolled, setIsScrolled] = useState(false);

    const validationErrors = useReleaseFormStore(
        (state) => state.validationErrors
    );
    const resetFormValues = useReleaseFormStore(
        (state) => state.resetFormValues
    );
    const messages = useTranslations();
    const router = useRouter();
    const params = useParams();
    const setFormValues = useReleaseFormStore((state) => state.setFormValues);
    const formValues = useReleaseFormStore((state) => state.formValues);
    const pathname = usePathname();
    const openModal = useModalStore((state) => state.openModal);
    const childrenRef = useRef<HTMLDivElement>(null);
    const releaseId = params['release-id'] ? `${params['release-id']}` : '';
    const { releaseData } = useGetDetailRelease(releaseId);

    const isCreateReleasePage = params['action'] === 'create';
    const isDisableTab = releaseId == '';

    const isDetailPage = pathname.includes(`/${RELEASES_TABS.CORE_DETAIL}`);
    const isTracksPage = pathname.includes(`/${RELEASES_TABS.TRACKS}`);

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
                        !isDisableTab || isCreateReleasePage
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

    const handleTabChange = (key: string) => {
        router.push(getReleaseDetailTabRoute(releaseId, key as RELEASES_TABS));
    };
    const handleSubmit = async () => {
        try {
            router.push(
                getReleaseDetailTabRoute(releaseId, RELEASES_TABS.CORE_DETAIL)
            );
            showNotification('success', 'Thông tin đã được lưu thành công');
        } catch (error) {
            console.error('Lỗi khi xác thực form:', error);
        }
    };

    const extraButton = (
        <div className="flex justify-end gap-2">
            {isTracksPage && (
                <Button
                    onClick={() => openModal(TYPE_MODAL_RELEASE.ADD_TRACK)}
                    type="primary"
                >
                    {messages('tracks.add')}
                </Button>
            )}

            {/* {isDetailPage && (
                <Button type="primary" onClick={handleSubmit}>
                    {messages('common.saveInfo')}
                </Button>
            )} */}
        </div>
    );

    useEffect(() => {
        const handleScroll = () => {
            const scrollContainer = childrenRef.current;
            if (!scrollContainer) return;

            console.log(
                '🚀 ~ handleScroll ~ scrollTop:',
                scrollContainer.scrollTop
            );

            if (scrollContainer.scrollTop > 20) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        const scrollContainer = childrenRef.current;
        if (scrollContainer) {
            scrollContainer.addEventListener('scroll', handleScroll, {
                passive: true,
            });

            return () => {
                scrollContainer.removeEventListener('scroll', handleScroll);
            };
        }
    }, []);

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

        const initialData: ReleaseFormStoreData = {
            ...releaseData,
        };

        if (releaseId) {
            setFormValues(initialData);
        }
    }, [releaseId, JSON.stringify(releaseData)]);

    return (
        <div className="flex h-full overflow-hidden">
            <div
                ref={childrenRef}
                className="flex h-full flex-1 flex-col overflow-y-auto"
            >
                <div className="sticky top-0 z-10 bg-white">
                    <ReleaseDetailHeader isScrolled={isScrolled} />
                    <div className="px-4">
                        <Tabs
                            className="tab-release-detail !pt-0"
                            items={items}
                            activeKey={activeTab}
                            onChange={handleTabChange}
                            tabBarExtraContent={extraButton}
                        />
                    </div>
                </div>
                <div className="flex-1">{children}</div>
            </div>
            <RightSidebar errors={validationErrors} />
        </div>
    );
}
