'use client';

import AppPageWrapper from '@/components/ant-music/app-page-wrapper';
import { APP_ROUTES } from '@/enums/routes';
import { Link, useRouter } from '@/i18n/routing';
import ExportTab from '@/modules/release-distribution/components/detail/export-tab';
import ImportTab from '@/modules/release-distribution/components/detail/import-tab';
import { PageContainer } from '@ant-design/pro-components';
import { Card, Tabs } from 'antd';
import { useTranslations } from 'next-intl';

type Props = {
    params: { id: string; locale: string };
};

export default function ReleaseDistributionDetailPage({ params }: Props) {
    const id = params?.id;
    const messages = useTranslations();
    const router = useRouter();

    const breadcrumbItems = [
        {
            title: (
                <Link href={APP_ROUTES.RELEASE_DISTRIBUTION}>
                    {messages('release.releaseDistribution')}
                </Link>
            ),
        },
        {
            title: `${messages('common.detail')} #${id}`,
        },
    ];

    const tabItems = [
        {
            key: 'export',
            label: 'Export',
            children: <ExportTab />,
        },
        {
            key: 'import',
            label: 'Import',
            children: <ImportTab />,
        },
    ];

    return (
        <AppPageWrapper>
            <PageContainer
                header={{
                    title: `${messages('common.detail')}`,
                    breadcrumb: { items: breadcrumbItems },
                }}
            >
                <Card className="shadow-sm">
                    <Tabs defaultActiveKey="export" items={tabItems} />
                </Card>
            </PageContainer>
        </AppPageWrapper>
    );
}
