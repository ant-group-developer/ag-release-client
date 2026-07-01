'use client';

import AppPageWrapper from '@/components/ant-music/app-page-wrapper';
import { APP_ROUTES } from '@/enums/routes';
import { Link } from '@/i18n/routing';
import ExportTab from '@/modules/release-distribution/components/detail/export-tab';
import ImportTab from '@/modules/release-distribution/components/detail/import-tab';
import { useGetReleaseCiDataDetail } from '@/modules/release-distribution/hooks/use-get-release-ci-data-detail';
import { PageContainer } from '@ant-design/pro-components';
import { Card, Tabs, TabsProps } from 'antd';
import { useTranslations } from 'next-intl';

type Props = {
    params: { id: string; locale: string };
};

export default function ReleaseDistributionDetailPage({ params }: Props) {
    const id = params?.id;
    const messages = useTranslations();
    const { releaseCiDataDetail, isFetching } = useGetReleaseCiDataDetail(id);

    const breadcrumbItems = [
        {
            title: (
                <Link href={APP_ROUTES.RELEASE_DISTRIBUTION}>
                    {messages('release.releaseDistribution')}
                </Link>
            ),
        },
        {
            title: `${releaseCiDataDetail?.release?.title}`,
        },
    ];

    const tabItems: TabsProps['items'] = [
        {
            key: 'import',
            label: messages('common.import'),
            children: (
                <ImportTab
                    data={releaseCiDataDetail?.importRawData}
                    loading={isFetching}
                />
            ),
        },
        {
            key: 'export',
            label: messages('common.export'),
            children: (
                <ExportTab
                    data={releaseCiDataDetail?.exportRawData}
                    loading={isFetching}
                />
            ),
        },
    ];

    return (
        <AppPageWrapper>
            <PageContainer
                header={{
                    title: `${releaseCiDataDetail?.release?.title} - ${releaseCiDataDetail?.release?.upc}`,
                    breadcrumb: { items: breadcrumbItems },
                }}
            >
                <Card className="shadow-sm">
                    <Tabs defaultActiveKey="import" items={tabItems} />
                </Card>
            </PageContainer>
        </AppPageWrapper>
    );
}
