'use client';

import { PAGE_SIZE } from '@/constants/page-size';
import { useFilter } from '@/hooks/use-filter';
import { useLoadingStatus } from '@/hooks/use-loading-status';
import ConfigTab from '@/modules/report-import/components/config-tab';
import DeleteReportTab from '@/modules/report-import/components/delete-report-tab';
import EnrichDataCronTab from '@/modules/report-import/components/enrich-data-cron-tab';
import EnrichDataImportTab from '@/modules/report-import/components/enrich-data-import-tab';
import FtpProviderConfigTab from '@/modules/report-import/components/ftp-provider-config-tab';
import ImportTab from '@/modules/report-import/components/import-tab';
import SftpExcludeTab from '@/modules/report-import/components/sftp-exclude-tab';
import SourceTypeConfigTab from '@/modules/report-import/components/source-type-config-tab';
import SpotifyR2SyncTab from '@/modules/report-import/components/spotify-r2-sync-tab';
import { reportConfigQueryKeys } from '@/modules/report-import/constants/query-keys';
import { REPORT_IMPORT_TAB } from '@/modules/report-import/enums';
import { useGetListReportConfig } from '@/modules/report-import/hooks/use-get-list';
import { ReportConfigDataFilter } from '@/modules/report-import/types';
import {
    ApiOutlined,
    AppstoreOutlined,
    ClockCircleOutlined,
    CloudServerOutlined,
    DatabaseOutlined,
    DeleteOutlined,
    ImportOutlined,
    SettingOutlined,
    SyncOutlined,
} from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-components';
import { Spin, Tabs, TabsProps, theme } from 'antd';
import { useTranslations } from 'next-intl';
import { useEffect, useMemo, useState } from 'react';

type ReportConfigFilter = ReportConfigDataFilter & {
    tab?: string;
};

export default function ReportConfigs() {
    const { token } = theme.useToken();
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
            {
                key: REPORT_IMPORT_TAB.ENRICH_DATA_CRON,
                label: messages('reportConfigs.enrichScanSchedules.label'),
                icon: <ClockCircleOutlined />,
                children: <EnrichDataCronTab />,
            },
            {
                key: REPORT_IMPORT_TAB.DELETE_REPORT,
                label: messages('release.deleteReport.title'),
                icon: <DeleteOutlined />,
                children: <DeleteReportTab />,
            },
            {
                key: REPORT_IMPORT_TAB.SPOTIFY_R2_SYNC,
                label: messages('reportConfigs.spotifyR2SyncConfig.label'),
                icon: <SyncOutlined />,
                children: <SpotifyR2SyncTab />,
            },
            {
                key: REPORT_IMPORT_TAB.SOURCE_TYPE_CONFIG,
                label: messages('reportConfigs.sourceTypeConfigs.label'),
                icon: <AppstoreOutlined />,
                children: <SourceTypeConfigTab />,
            },
            {
                key: REPORT_IMPORT_TAB.FTP_PROVIDER_CONFIG,
                label: messages('reportConfigs.ftpProviderConfig.label'),
                icon: <ApiOutlined />,
                children: <FtpProviderConfigTab />,
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
        <PageContainer title={messages('reportConfigs.label')}>
            <div
                className="rounded-lg"
                style={{
                    backgroundColor: token.colorBgContainer,
                }}
            >
                <Spin spinning={isLoading}>
                    <div className="m-auto">
                        <Tabs
                            activeKey={activeTab}
                            onChange={handleTabChange}
                            items={tabItems}
                            className="!p-6"
                            tabPosition="left"
                        />
                    </div>
                </Spin>
            </div>
        </PageContainer>
    );
}
