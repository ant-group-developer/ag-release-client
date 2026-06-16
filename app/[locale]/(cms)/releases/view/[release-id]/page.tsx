'use client';

import ReleaseViewHeader from '@/modules/releases/components/view/header';
import { useGetDetailRelease } from '@/modules/releases/hooks/use-get-detail-release';
import { CustomerServiceOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { Breadcrumb, Space, Spin, Tabs, theme, Typography } from 'antd';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';

import OverviewTab from '@/modules/releases/components/view/overview-tab';

const { Text } = Typography;

export default function ReleaseDetailView() {
    const params = useParams();
    const messages = useTranslations();
    const releaseId = params['release-id'] as string;
    const { token } = theme.useToken();

    const { releaseData, isLoading: isReleaseLoading } =
        useGetDetailRelease(releaseId);

    if (isReleaseLoading) {
        return (
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '80vh',
                }}
            >
                <Spin
                    size="large"
                    tip={messages('common.loading') || 'Loading...'}
                />
            </div>
        );
    }

    if (!releaseData) {
        return (
            <div style={{ padding: '24px', textAlign: 'center' }}>
                <Text type="danger">
                    {messages('common.error') || 'Release not found'}
                </Text>
            </div>
        );
    }

    const breadcrumbItems = [
        {
            title: messages('release.releases') || 'Releases',
        },
        {
            title: releaseData.title,
        },
    ];

    const tabItems = [
        {
            key: 'overview',
            label: (
                <Space>
                    <InfoCircleOutlined />
                    {messages('common.overview')}
                </Space>
            ),
            children: (
                <OverviewTab releaseData={releaseData} />
            ),
        },
        {
            key: 'tracks',
            label: (
                <Space>
                    <CustomerServiceOutlined />
                    {messages('common.tracks')}
                </Space>
            ),
            children: (
                <div style={{ padding: '24px 0' }}>
                    <Text type="secondary">Tracks Content Placeholder</Text>
                </div>
            ),
        },
    ];

    return (
        <div
            className="flex flex-1 overflow-y-hidden overflow-x-clip"
            style={{
                backgroundColor: token.colorBgLayout,
                minHeight: 'calc(100vh - 4rem)',
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
                            className="tab-release-detail !pt-0"
                            style={{
                                backgroundColor: token.colorBgContainer,
                            }}
                            items={tabItems}
                            defaultActiveKey="overview"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
