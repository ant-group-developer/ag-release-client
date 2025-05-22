'use client';
import { cn } from '@/helpers/common';
import { Link, useRouter } from '@/i18n/routing';
import ReleaseDetailHeader from '@/modules/release-detail/header';
import RightSidebar from '@/modules/release-detail/right-sidebar';
import { RELEASES_TABS } from '@/modules/releases/enums';
import { useReleaseFormStore } from '@/modules/releases/hooks/releaseFormStore';
import { Button, Tabs, TabsProps } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { useParams, usePathname } from 'next/navigation';
import { PropsWithChildren, useEffect, useState } from 'react';

type Props = {};

export default function ReleaseDetail({ children }: PropsWithChildren) {
    const [form] = useForm();
    const router = useRouter();
    const params = useParams();
    const releaseId = params['release-id'] ? `/${params['release-id']}` : '';
    const isCreate = params['action'] === 'create';
    const isDisableTab = releaseId == '';
    const setForm = useReleaseFormStore((state) => state.setForm);
    const pathname = usePathname();
    const [activeTab, setActiveTab] = useState<string>(
        RELEASES_TABS.CORE_DETAIL
    );

    useEffect(() => {
        setForm(form);
    }, [form, setForm]);

    useEffect(() => {
        // Cập nhật tab active khi đường dẫn thay đổi
        if (pathname) {
            if (pathname.includes('/tracks')) {
                setActiveTab(RELEASES_TABS.TRACKS);
            } else if (pathname.includes('/schedule')) {
                setActiveTab(RELEASES_TABS.SCHEDULE);
            } else if (pathname.includes('/review')) {
                setActiveTab(RELEASES_TABS.REVIEW);
            } else if (
                pathname.includes('/core-detail') ||
                pathname.includes('/create')
            ) {
                setActiveTab(RELEASES_TABS.CORE_DETAIL);
            }
        }
    }, [pathname]);

    const coreDetailTabsNavigate = isCreate
        ? '/releases/create'
        : `/releases/detail/${releaseId}/core-detail`;

    const items: TabsProps['items'] = [
        {
            key: RELEASES_TABS.CORE_DETAIL,
            label: (
                <Link
                    className={cn(
                        !isDisableTab || isCreate ? '' : 'pointer-events-none'
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
                    className={cn(isDisableTab ? 'pointer-events-none' : '')}
                    href={`releases/detail/${releaseId}/tracks`}
                >
                    <span className="font-medium">Bản nhạc</span>
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
            const values = await form?.validateFields();
            router.push(`/releases/detail/341239532/core-detail`);
        } catch (error) {
            console.error('Lỗi khi xác thực form:', error);
        }
    };

    const buttonSave = (
        <div className="flex justify-end p-4">
            <Button type="primary" onClick={handleSubmit}>
                Lưu thông tin
            </Button>
        </div>
    );

    return (
        <div className="pr-[50px]">
            <div className="sticky top-0 z-10 bg-white">
                <ReleaseDetailHeader form={form} />
                <div className="px-4">
                    <Tabs
                        className="tab-release-detail"
                        items={items}
                        activeKey={activeTab}
                        onChange={handleTabChange}
                        tabBarExtraContent={buttonSave}
                    />
                </div>
            </div>
            {children}
            <RightSidebar />
        </div>
    );
}
