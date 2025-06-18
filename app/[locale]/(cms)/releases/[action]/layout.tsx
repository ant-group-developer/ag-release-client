'use client';
import { LOCALE } from '@/enums/common';
import { cn } from '@/helpers/common';
import { showNotification } from '@/helpers/messages-helper';
import useModalStore from '@/hooks/use-modal';
import { Link, useRouter } from '@/i18n/routing';
import ReleaseDetailHeader from '@/modules/release-detail/header';
import RightSidebar from '@/modules/release-detail/right-sidebar';
import {
    RELEASES_TABS,
    RELEASES_TYPE,
    TYPE_MODAL_RELEASE,
} from '@/modules/releases/enums';
import { useReleaseFormStore } from '@/modules/releases/hooks/releaseFormStore';
import { ReleaseFormValuesData } from '@/modules/releases/types';
import { GENRES } from '@/modules/tracks/enums';
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
    const validationErrors = useReleaseFormStore(
        (state) => state.validationErrors
    );
    const pathname = usePathname();
    const openModal = useModalStore((state) => state.openModal);
    const [activeTab, setActiveTab] = useState<string>(
        RELEASES_TABS.CORE_DETAIL
    );

    const isDetailPage = pathname.includes('/core-detail');
    const [isScrolledOnDetailPage, setIsScrolledOnDetailPage] = useState(false);
    const childrenRef = useRef<HTMLDivElement>(null);

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

            {isDetailPage && (
                <Button type="primary" onClick={handleSubmit}>
                    Lưu thông tin
                </Button>
            )}
        </div>
    );

    const headerIsScrolled = isDetailPage ? isScrolledOnDetailPage : true;

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

        // Set initial scroll state if it's a detail page and already scrolled
        if (isDetailPage) {
            if (childrenRef.current && childrenRef.current.scrollTop > 10) {
                setIsScrolledOnDetailPage(true);
            } else {
                setIsScrolledOnDetailPage(false);
            }
        }
    }, [pathname, isDetailPage]);

    useEffect(() => {
        const handleScroll = () => {
            if (!childrenRef.current || !isDetailPage) return;
            if (
                childrenRef.current.scrollHeight >
                childrenRef.current.clientHeight
            ) {
                const newIsScrolled = childrenRef.current.scrollTop > 0;
                if (newIsScrolled !== isScrolledOnDetailPage) {
                    setIsScrolledOnDetailPage(newIsScrolled);
                }
            }
        };

        const currentRef = childrenRef.current;
        if (currentRef && isDetailPage) {
            currentRef.addEventListener('scroll', handleScroll);
        }
        return () => {
            if (currentRef) {
                currentRef.removeEventListener('scroll', handleScroll);
            }
        };
    }, [isScrolledOnDetailPage, isDetailPage]);

    useEffect(() => {
        // Chỉ set initialData nếu chưa có data trong store
        const releaseId = params['release-id'];

        if (releaseId && (!formValues || !formValues.nameRelease)) {
            // fake data
            const initialData: ReleaseFormValuesData = {
                id: 'R100000001',
                releaseType: RELEASES_TYPE.ALBUM,
                nameRelease: 'Album Mới 2024',
                isMoreThan4Artists: false,
                artists: [
                    {
                        id: 'Sơn Tùng MTP',
                        name: 'Sơn Tùng MTP',
                        role: 'Main Artist',
                    },
                ],
                genres: GENRES.HIP_HOP,
                subGenres: GENRES.HIP_HOP,
                label: 'ANT-MUSIC',
                upc: '123456789012',
                catalogId: 'CAT-2024-001',
                cLineYear: 'ANT-MUSIC',
                pLineYear: 'ANT-MUSIC',
                thumbnail: {
                    fileList: [
                        {
                            uid: '-1',
                            name: 'album-cover.jpg',
                            status: 'done',
                            url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
                            thumbUrl:
                                'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
                        },
                    ],
                },
                version: '',
                metaDataLanguage: LOCALE.VI,
                tracks: [],
                releaseDate: '',
                timezone: '',
                territory: undefined,
                platforms: [],
                artistsApplyAllTracks: [],
            };
            setFormValues(initialData);
        }
    }, [releaseId]);

    return (
        <div className="flex h-full overflow-hidden">
            <div
                ref={childrenRef}
                className="flex h-full flex-1 flex-col overflow-y-auto"
            >
                <div className="sticky top-0 z-10 bg-white">
                    <ReleaseDetailHeader isScrolled={headerIsScrolled} />
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
                <div className="flex-1">{children}</div>
            </div>
            <RightSidebar errors={validationErrors} />
        </div>
    );
}
