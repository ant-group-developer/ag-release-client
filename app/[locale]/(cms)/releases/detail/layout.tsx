'use client';
import { useRouter } from '@/i18n/routing';
import ReleaseDetailHeader from '@/modules/release-detail/header';
import { RELEASES_TABS } from '@/modules/releases/enums';
import { Tabs, TabsProps } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { useParams } from 'next/navigation';
import { PropsWithChildren } from 'react';
import CoreDetail from './[release-id]/core-detail/page';
import Review from './[release-id]/review/page';
import Schedule from './[release-id]/schedule/page';
import Tracks from './[release-id]/tracks/page';

type Props = {};

export default function ReleaseDetail({ children }: PropsWithChildren) {
    const [form] = useForm();
    const router = useRouter();
    const params = useParams();
    const releaseId = params['release-id'] ? `/${params['release-id']}` : '';
    const isDisableTab = releaseId == '';

    const items: TabsProps['items'] = [
        {
            key: RELEASES_TABS.CORE_DETAIL,
            label: <span className="font-medium">Thông tin chung</span>,
            children: <CoreDetail form={form} />,
            disabled: isDisableTab,
        },
        {
            key: RELEASES_TABS.TRACKS,
            label: <span className="font-medium">Bản nhạc</span>,
            children: <Tracks form={form} />,
            disabled: isDisableTab,
        },
        {
            key: RELEASES_TABS.SCHEDULE,
            label: <span className="font-medium">Lên lịch</span>,
            children: <Schedule form={form} />,
            disabled: isDisableTab,
        },
        {
            key: RELEASES_TABS.REVIEW,
            label: <span className="font-medium">Review</span>,
            children: <Review form={form} />,
            disabled: isDisableTab,
        },
    ];

    // Xác định active tab dựa trên đường dẫn hiện tại
    const getActiveTab = () => {
        const path = window.location.pathname;
        if (path.includes('/tracks/')) return RELEASES_TABS.TRACKS;
        if (path.includes('/schedule/')) return RELEASES_TABS.SCHEDULE;
        if (path.includes('/review/')) return RELEASES_TABS.REVIEW;
        return RELEASES_TABS.CORE_DETAIL;
    };

    const handleChangeTab = (key: string) => {
        if (key === RELEASES_TABS.CORE_DETAIL) {
            router.push(`/releases/detail${releaseId}/core-detail`);
        } else if (key === RELEASES_TABS.TRACKS) {
            router.push(`/releases/detail/${releaseId}/tracks`);
        } else if (key === RELEASES_TABS.SCHEDULE) {
            router.push(`/releases/detail/${releaseId}/schedule`);
        } else if (key === RELEASES_TABS.REVIEW) {
            router.push(`/releases/detail/${releaseId}/review`);
        }
    };

    return (
        <div className="sticky top-0 z-10">
            {/* <SidebarSecondary /> */}
            <ReleaseDetailHeader form={form} />
            <div className="p-4">
                <Tabs
                    items={items}
                    onChange={handleChangeTab}
                    defaultActiveKey={getActiveTab()}
                />
            </div>
        </div>
    );
}
