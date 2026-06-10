'use client';

import AppPageWrapper from '@/components/ant-music/app-page-wrapper';
import { PAGE_SIZE } from '@/constants/page-size';
import { useFilter } from '@/hooks/use-filter';
import { useLoadingStatus } from '@/hooks/use-loading-status';
import ConfigTab from '@/modules/report-configs/components/config-tab';
import ImportTab from '@/modules/report-configs/components/import-tab';
import { reportConfigQueryKeys } from '@/modules/report-configs/constants/query-keys';
import { useGetListReportConfig } from '@/modules/report-configs/hooks/use-get-list';
import {
    ReportConfigDataFilter,
} from '@/modules/report-configs/types';
import { PageContainer } from '@ant-design/pro-components';
import { Tabs, TabsProps } from 'antd';
import { useTranslations } from 'next-intl';

type ReportConfigFilter = ReportConfigDataFilter & {
    tab?: string;
};

export default function ReportConfigs() {
    const messages = useTranslations();
    const { dataFilter, onChangeFilter, onChangePage, onSearch } =
        useFilter<ReportConfigFilter>({
            tab: 'config-report',
            page: 1,
            pageSize: PAGE_SIZE,
        });
    const { isLoading } = useLoadingStatus({
        queryKeys: [reportConfigQueryKeys.lists()],
        mutationKeys: [reportConfigQueryKeys.all],
    });

    const { tab, ...apiParams } = dataFilter;
    const { reportConfigsData } = useGetListReportConfig(apiParams);

    const tabItems: TabsProps['items'] = [
        {
            key: 'config-report',
            label: messages('reportConfigs.configReport'),
            children: (
                <ConfigTab
                    dataFilter={dataFilter}
                    reportConfigsData={reportConfigsData}
                    isLoading={isLoading}
                    onSearch={onSearch}
                    onChangePage={onChangePage}
                />
            ),
        },
        {
            key: 'import-report',
            label: messages('reportConfigs.importReport'),
            children: <ImportTab />,
        },
    ];

    return (
        <AppPageWrapper>
            <PageContainer title={messages('reportConfigs.label')}>
                <Tabs
                    activeKey={dataFilter.tab}
                    onChange={(key) => onChangeFilter({ tab: key })}
                    items={tabItems}
                />
            </PageContainer>
        </AppPageWrapper>
    );
}
