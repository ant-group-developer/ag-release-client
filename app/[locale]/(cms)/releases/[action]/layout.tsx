'use client';
import { cn } from '@/helpers/common';
import { showNotification } from '@/helpers/messages-helper';
import useModalStore from '@/hooks/use-modal';
import { Link, useRouter } from '@/i18n/routing';
import ReleaseDetailHeader from '@/modules/release-detail/header';
import RightSidebar from '@/modules/release-detail/right-sidebar';
import { RELEASES_TABS, TYPE_MODAL_RELEASE } from '@/modules/releases/enums';
import { useReleaseFormStore } from '@/modules/releases/hooks/releaseFormStore';
import { Button, Tabs, TabsProps } from 'antd';
import { useParams, usePathname } from 'next/navigation';
import { PropsWithChildren, useEffect, useRef, useState } from 'react';

type Props = {};

export default function ReleaseDetail({ children }: PropsWithChildren) {
    const router = useRouter();
    const params = useParams();
    const releaseId = params['release-id'] ? `/${params['release-id']}` : '';
    const isCreateReleasePage = params['action'] === 'create';
    const isDisableTab = releaseId == '';
    const setFormValues = useReleaseFormStore((state) => state.setFormValues);
    const formValues = useReleaseFormStore((state) => state.formValues);
    const pathname = usePathname();
    const openModal = useModalStore((state) => state.openModal);
    const [activeTab, setActiveTab] = useState<string>(
        RELEASES_TABS.CORE_DETAIL
    );
    const [isScrolled, setIsScrolled] = useState(false);
    const childrenRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const getActiveTab = () => {
            const map: Record<string, string> = {
                [RELEASES_TABS.CORE_DETAIL]: RELEASES_TABS.CORE_DETAIL,
                [RELEASES_TABS.TRACKS]: RELEASES_TABS.TRACKS,
                [RELEASES_TABS.SCHEDULE]: RELEASES_TABS.SCHEDULE,
                [RELEASES_TABS.REVIEW]: RELEASES_TABS.REVIEW,
                [RELEASES_TABS.DISTRIBUTION]: RELEASES_TABS.DISTRIBUTION,
            };
            const tabKey = pathname.split('/').pop();
            return map[tabKey ?? ''] || RELEASES_TABS.CORE_DETAIL;
        };
        setActiveTab(getActiveTab());
    }, [pathname]);

    const coreDetailTabsNavigate = isCreateReleasePage
        ? '/releases/create'
        : `/releases/detail/${releaseId}/core-detail`;

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
                    <span className="font-medium">Thông tin chung</span>
                </Link>
            ),
            disabled: isDisableTab,
        },
        {
            key: RELEASES_TABS.TRACKS,
            label: (
                <Link
                    // className={cn(isDisableTab ? 'invisible' : 'visible')}
                    className={cn(
                        !isDisableTab || isCreateReleasePage
                            ? ''
                            : 'pointer-events-none'
                    )}
                    href={`releases/detail/${releaseId}/tracks`}
                >
                    <span className="font-medium">Bản nhạc</span>
                </Link>
            ),
            disabled: isDisableTab,
        },
        {
            key: RELEASES_TABS.SCHEDULE,
            label: (
                <Link
                    className={cn(isDisableTab ? 'pointer-events-none' : '')}
                    href={`/releases/detail/${releaseId}/schedule`}
                >
                    <span className="font-medium">Lên lịch</span>
                </Link>
            ),
            disabled: isDisableTab,
        },
        {
            key: RELEASES_TABS.REVIEW,
            label: (
                <Link
                    className={cn(isDisableTab ? 'pointer-events-none' : '')}
                    href={`/releases/detail/${releaseId}/review`}
                >
                    <span className="font-medium">Review</span>
                </Link>
            ),
            disabled: isDisableTab,
        },
        {
            key: RELEASES_TABS.DISTRIBUTION,
            label: (
                <Link
                    className={cn(isDisableTab ? 'pointer-events-none' : '')}
                    href={`/releases/detail/${releaseId}/distribution`}
                >
                    <span className="font-medium">Phân phối</span>
                </Link>
            ),
            disabled: isDisableTab,
        },
    ];

    const handleTabChange = (key: string) => {
        router.push(`/releases/detail/${releaseId}/${key}`);
    };

    const handleSubmit = async () => {
        try {
            router.push(`/releases/detail/341239532/core-detail`);
            showNotification('success', 'Thông tin đã được lưu thành công');
        } catch (error) {
            console.error('Lỗi khi xác thực form:', error);
        }
    };

    const isTracksPage = pathname.includes('/tracks');

    const buttonSave = (
        <div className="flex justify-end gap-2 p-4">
            {isTracksPage && (
                <Button
                    onClick={() => openModal(TYPE_MODAL_RELEASE.ADD_TRACK)}
                    type="primary"
                >
                    Thêm bài hát
                </Button>
            )}

            <Button type="primary" onClick={handleSubmit}>
                Lưu thông tin
            </Button>
        </div>
    );

    useEffect(() => {
        const handleScroll = () => {
            if (!childrenRef.current) return; // Đảm bảo childrenRef.current không phải null
            const newIsScrolled = childrenRef.current.scrollTop > 10;
            if (newIsScrolled !== isScrolled) {
                setIsScrolled(newIsScrolled);
            }
        };

        if (childrenRef.current) {
            childrenRef.current.addEventListener('scroll', handleScroll);
        }
        return () => {
            if (childrenRef.current) {
                childrenRef.current.removeEventListener('scroll', handleScroll);
            }
        };
    }, [isScrolled]);

    return (
        <div className="flex h-full pr-[250px]">
            <div className="flex h-full flex-1 flex-col">
                <div className="sticky top-0 z-10 bg-white">
                    <ReleaseDetailHeader isScrolled={isScrolled} />
                    <div className="px-4">
                        <Tabs
                            className="tab-release-detail !pt-0"
                            items={items}
                            activeKey={activeTab}
                            onChange={handleTabChange}
                            tabBarExtraContent={buttonSave}
                        />
                    </div>
                </div>
                <div ref={childrenRef} className="flex-1 overflow-y-auto">
                    {children}
                </div>
            </div>
            <RightSidebar />
        </div>
    );
}
