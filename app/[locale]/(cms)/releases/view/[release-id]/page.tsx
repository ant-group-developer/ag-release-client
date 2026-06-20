'use client';

import { APP_ROUTES } from '@/enums/routes';
import { useFilter } from '@/hooks/use-filter';
import { Link } from '@/i18n/routing';
import { RELEASE_VIEW_TABS } from '@/modules/releases/enums';
import { useGetDetailRelease } from '@/modules/releases/hooks/use-get-detail-release';
import {
    BarChartOutlined,
    CalendarOutlined,
    CustomerServiceOutlined,
    InfoCircleOutlined,
    PartitionOutlined,
} from '@ant-design/icons';
import { Breadcrumb, Space, Tabs, theme } from 'antd';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import AnalyticsTab from '@/modules/releases/components/view/analytics-tab';
import DistributionTab from '@/modules/releases/components/view/distribution-tab';
import ReleaseViewHeader from '@/modules/releases/components/view/header';
import OverviewTab from '@/modules/releases/components/view/overview-tab';
import ScheduleTab from '@/modules/releases/components/view/schedule-tab';
import TracksTab from '@/modules/releases/components/view/tracks-tab';

export default function ReleaseDetailView() {
    const params = useParams();
    const messages = useTranslations();
    const releaseId = params['release-id'] as string;
    const { token } = theme.useToken();

    const { dataFilter, onChangeFilter } = useFilter<any>({
        tab: RELEASE_VIEW_TABS.OVERVIEW,
    });

    const [activeTab, setActiveTab] = useState<string>(
        dataFilter.tab || RELEASE_VIEW_TABS.OVERVIEW
    );

    useEffect(() => {
        if (dataFilter.tab && dataFilter.tab !== activeTab) {
            setActiveTab(dataFilter.tab);
        }
    }, [activeTab, dataFilter.tab]);

    const handleTabChange = (key: string) => {
        setActiveTab(key);
        onChangeFilter({ tab: key });
    };

    const { releaseData, isLoading: isReleaseLoading } =
        useGetDetailRelease(releaseId);

    const breadcrumbItems = [
        {
            title: (
                <Link href={APP_ROUTES.RELEASES}>
                    {messages('release.releases')}
                </Link>
            ),
        },
        {
            title: releaseData.title,
        },
    ];

    const tabItems = [
        {
            key: RELEASE_VIEW_TABS.OVERVIEW,
            label: (
                <Space>
                    <InfoCircleOutlined />
                    {messages('common.overview')}
                </Space>
            ),
        },
        {
            key: RELEASE_VIEW_TABS.TRACKS,
            label: (
                <Space>
                    <CustomerServiceOutlined />
                    {messages('common.tracks')}
                </Space>
            ),
        },
        {
            key: RELEASE_VIEW_TABS.SCHEDULE,
            label: (
                <Space>
                    <CalendarOutlined />
                    {messages('release.scheduling.label')}
                </Space>
            ),
        },
        {
            key: RELEASE_VIEW_TABS.DISTRIBUTION,
            label: (
                <Space>
                    <PartitionOutlined />
                    {messages('distribute.label')}
                </Space>
            ),
        },
        {
            key: RELEASE_VIEW_TABS.ANALYTICS,
            label: (
                <Space>
                    <BarChartOutlined />
                    {messages('analytics.label')}
                </Space>
            ),
        },
    ];

    const renderActiveTabContent = () => {
        switch (activeTab) {
            case RELEASE_VIEW_TABS.TRACKS:
                return <TracksTab releaseId={releaseId} />;
            case RELEASE_VIEW_TABS.ANALYTICS:
                return <AnalyticsTab releaseId={releaseId} />;
            case RELEASE_VIEW_TABS.SCHEDULE:
                return <ScheduleTab releaseData={releaseData} />;
            case RELEASE_VIEW_TABS.DISTRIBUTION:
                return <DistributionTab releaseData={releaseData} />;
            case RELEASE_VIEW_TABS.OVERVIEW:
            default:
                return <OverviewTab releaseData={releaseData} />;
        }
    };

    return (
        <div
            className="flex min-h-[calc(100vh-4rem)] flex-1 overflow-y-hidden overflow-x-clip"
            style={{
                backgroundColor: token.colorBgLayout,
            }}
        >
            <div className="thin-scrollbar mx-auto flex h-[calc(100vh-4rem)] min-w-0 flex-1 flex-col overflow-y-auto px-8">
                <Breadcrumb items={breadcrumbItems} className="!py-4" />
                <div
                    id="release-header"
                    className="mb-4 rounded-lg p-4 shadow-sm"
                    style={{
                        backgroundColor: token.colorBgContainer,
                    }}
                >
                    <ReleaseViewHeader releaseData={releaseData} />

                    <div
                        className="rounded-lg"
                        style={{
                            backgroundColor: token.colorBgContainer,
                        }}
                    >
                        <Tabs
                            className="tab-release-detail"
                            style={{
                                backgroundColor: token.colorBgContainer,
                            }}
                            items={tabItems}
                            activeKey={activeTab}
                            onChange={handleTabChange}
                        />
                    </div>
                </div>

                <div>{renderActiveTabContent()}</div>
            </div>
        </div>
    );
}
