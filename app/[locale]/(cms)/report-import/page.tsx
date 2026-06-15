'use client';

import AppPageWrapper from '@/components/ant-music/app-page-wrapper';
import { PAGE_SIZE } from '@/constants/page-size';
import { useFilter } from '@/hooks/use-filter';
import { useLoadingStatus } from '@/hooks/use-loading-status';
import ConfigTab from '@/modules/report-import/components/config-tab';
import EnrichDataImportTab from '@/modules/report-import/components/enrich-data-import-tab';
import ImportTab from '@/modules/report-import/components/import-tab';
import SftpExcludeTab from '@/modules/report-import/components/sftp-exclude-tab';
import { reportConfigQueryKeys } from '@/modules/report-import/constants/query-keys';
import { REPORT_IMPORT_TAB } from '@/modules/report-import/enums';
import { useGetListReportConfig } from '@/modules/report-import/hooks/use-get-list';
import { ReportConfigDataFilter } from '@/modules/report-import/types';
import {
    CloudServerOutlined,
    DatabaseOutlined,
    ImportOutlined,
    SettingOutlined,
} from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-components';
import { Tabs, TabsProps } from 'antd';
import { useTranslations } from 'next-intl';
import { useEffect, useMemo, useState } from 'react';

type ReportConfigFilter = ReportConfigDataFilter & {
    tab?: string;
};

export default function ReportConfigs() {
    const messages = useTranslations();
    const { dataFilter, onChangeFilter, onChangePage, onSearch } =
        useFilter<ReportConfigFilter>({
            tab: REPORT_IMPORT_TAB.CONFIG,
            page: 1,
            pageSize: PAGE_SIZE,
        });
    const { isLoading } = useLoadingStatus({
        queryKeys: [reportConfigQueryKeys.lists()],
        mutationKeys: [reportConfigQueryKeys.all],
    });

    const { tab, ...apiParams } = dataFilter;
    const { reportConfigsData } = useGetListReportConfig(apiParams);

    const [activeTab, setActiveTab] = useState<string>(
        dataFilter.tab || REPORT_IMPORT_TAB.CONFIG
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

    const tabItems = useMemo<TabsProps['items']>(
        () => [
            {
                key: REPORT_IMPORT_TAB.CONFIG,
                label: messages('reportConfigs.configReport'),
                icon: <SettingOutlined />,
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
                key: REPORT_IMPORT_TAB.IMPORT,
                label: messages('reportConfigs.importReport'),
                icon: <ImportOutlined />,
                children: <ImportTab />,
            },
            {
                key: REPORT_IMPORT_TAB.SFTP,
                label: messages('reportConfigs.importSftp'),
                icon: <CloudServerOutlined />,
                children: <SftpExcludeTab />,
            },
            {
                key: REPORT_IMPORT_TAB.ENRICH_DATA_IMPORT,
                label: messages('reportConfigs.enrichDataImport.label'),
                icon: <DatabaseOutlined />,
                children: <EnrichDataImportTab />,
            },
        ],
        [
            dataFilter,
            reportConfigsData,
            isLoading,
            messages,
            onChangePage,
            onSearch,
        ]
    );

    return (
        <AppPageWrapper>
            <PageContainer>
                <Tabs
                    activeKey={activeTab}
                    onChange={handleTabChange}
                    items={tabItems}
                    className="!mt-4"
                />
            </PageContainer>
        </AppPageWrapper>
    );
}
