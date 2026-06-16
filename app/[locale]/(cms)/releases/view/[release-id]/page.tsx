'use client';

import { useFilter } from '@/hooks/use-filter';
import { RELEASE_VIEW_TABS } from '@/modules/releases/enums';
import { useGetDetailRelease } from '@/modules/releases/hooks/use-get-detail-release';
import { CustomerServiceOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { Breadcrumb, Space, Tabs, theme, Typography } from 'antd';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import ReleaseViewHeader from '@/modules/releases/components/view/header';
import OverviewTab from '@/modules/releases/components/view/overview-tab';
import TracksTab from '@/modules/releases/components/view/tracks-tab';

const { Text } = Typography;

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
    }, [dataFilter.tab]);

    const handleTabChange = (key: string) => {
        setActiveTab(key);
        onChangeFilter({ tab: key });
    };

    const { releaseData, isLoading: isReleaseLoading } =
        useGetDetailRelease(releaseId);

    const breadcrumbItems = [
        {
            title: messages('release.releases'),
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
            children: <OverviewTab releaseData={releaseData} />,
        },
        {
            key: RELEASE_VIEW_TABS.TRACKS,
            label: (
                <Space>
                    <CustomerServiceOutlined />
                    {messages('common.tracks')}
                </Space>
            ),
            children: <TracksTab releaseId={releaseId} />,
        },
    ];

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
                    className="mb-4 rounded-lg p-4"
                    style={{
                        backgroundColor: token.colorBgContainer,
                    }}
                >
                    <ReleaseViewHeader releaseData={releaseData} />
                    <div>
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
            </div>
        </div>
    );
}
