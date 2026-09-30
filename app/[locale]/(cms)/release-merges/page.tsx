'use client';

import AppPageWrapper from '@/components/ant-music/app-page-wrapper';
import ReleaseMergeScansPage from '@/modules/release-merge/components/scans-page';
import { PageContainer } from '@ant-design/pro-components';
import { useTranslations } from 'next-intl';

export default function ReleaseMergesPage() {
    const messages = useTranslations();

    return (
        <AppPageWrapper>
            <PageContainer title={messages('releaseMerge.label')}>
                <ReleaseMergeScansPage />
            </PageContainer>
        </AppPageWrapper>
    );
}
