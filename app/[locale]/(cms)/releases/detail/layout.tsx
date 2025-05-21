'use client';
import { useRouter } from '@/i18n/routing';
import ReleaseDetailHeader from '@/modules/release-detail/header';
import { RELEASES_TABS } from '@/modules/releases/enums';
import { useReleaseFormStore } from '@/modules/releases/hooks/releaseFormStore';
import { Tabs, TabsProps } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { useParams, usePathname } from 'next/navigation';
import { PropsWithChildren, useEffect } from 'react';

type Props = {};

export default function ReleaseDetail({ children }: PropsWithChildren) {
    const [form] = useForm();
    const router = useRouter();
    const params = useParams();
    const releaseId = params['release-id'] ? `/${params['release-id']}` : '';
    const isDisableTab = releaseId == '';
    const setForm = useReleaseFormStore((state) => state.setForm);
    const pathname = usePathname();

    // Lưu form vào store khi component mount
    useEffect(() => {
        setForm(form);
    }, [form, setForm]);

    const items: TabsProps['items'] = [
        {
            key: RELEASES_TABS.CORE_DETAIL,
            label: <span className="font-medium">Thông tin chung</span>,
            disabled: isDisableTab,
        },
        {
            key: RELEASES_TABS.TRACKS,
            label: <span className="font-medium">Bản nhạc</span>,
            disabled: isDisableTab,
        },
        {
            key: RELEASES_TABS.SCHEDULE,
            label: <span className="font-medium">Lên lịch</span>,
            disabled: isDisableTab,
        },
        {
            key: RELEASES_TABS.REVIEW,
            label: <span className="font-medium">Review</span>,
            disabled: isDisableTab,
        },
    ];
    const getActiveTab = () => {
        const path = window.location.pathname;
        if (path.includes('/tracks')) return RELEASES_TABS.TRACKS;
        if (path.includes('/schedule')) return RELEASES_TABS.SCHEDULE;
        if (path.includes('/review')) return RELEASES_TABS.REVIEW;
        return RELEASES_TABS.CORE_DETAIL;
    };

    const handleTabChange = (key: string) => {
        // key là tên tab, ví dụ: 'core-detail', 'tracks', ...
        router.push(`/releases/detail/${releaseId}/${key}`);
    };

    return (
        <div>
            {/* <SidebarSecondary /> */}
            <div className="sticky top-0 z-10 bg-white">
                <ReleaseDetailHeader form={form} />
                <div className="px-4">
                    <Tabs
                        items={items}
                        defaultActiveKey={getActiveTab()}
                        onChange={handleTabChange}
                    />
                </div>
            </div>
            {children}
        </div>
    );
}
