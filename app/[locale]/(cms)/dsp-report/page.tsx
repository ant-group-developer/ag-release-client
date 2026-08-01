'use client';

import AppPageWrapper from '@/components/ant-music/app-page-wrapper';
import AppSearch from '@/components/ui/input/search';
import AppPagination from '@/components/ui/pagination';
import { SIZE_ICON } from '@/constants/common';
import { PAGE_SIZE, PAGE_SIZE_OPTIONS } from '@/constants/page-size';
import { useFilter } from '@/hooks/use-filter';
import { FtpFileDiscoveryRunsModal } from '@/modules/dsp-report/components/modal/ftp-file-discovery-runs-modal';
import { DspReportTable } from '@/modules/dsp-report/components/table';
import { useGetListDspReport } from '@/modules/dsp-report/hooks/use-get-list-dsp-report';
import { DspReportDataFilter } from '@/modules/dsp-report/types';
import { PageContainer } from '@ant-design/pro-components';
import { Button, Select, Space, theme } from 'antd';
import { History } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

export default function DspReport() {
    const messages = useTranslations();
    const { token } = theme.useToken();
    const [isDiscoveryRunsModalOpen, setIsDiscoveryRunsModalOpen] =
        useState(false);
    const { dataFilter, onChangeFilter, onChangePage, onSearch } =
        useFilter<DspReportDataFilter>({
            page: 1,
            pageSize: PAGE_SIZE,
        });

    const { dspReportData, refetch, isLoading } =
        useGetListDspReport(dataFilter);

    return (
        <AppPageWrapper>
            <PageContainer
                title={messages('dspReport.label')}
                style={{
                    backgroundColor: token.colorBgLayout,
                }}
            >
                <DspReportTable
                    sticky
                    dataSource={dspReportData?.items ?? []}
                    loading={isLoading}
                    pagination={{
                        pageSize: dataFilter.pageSize ?? PAGE_SIZE,
                        current: dspReportData?.metadata?.page,
                        total: dspReportData?.metadata?.totalItems,
                    }}
                    headerTitle={
                        <Space>
                            <AppSearch
                                className="max-w-52"
                                onChange={onSearch}
                                defaultValue={dataFilter.keyword}
                            />
                            <Select
                                className="w-52"
                                placeholder={messages('dspReport.table.source')}
                                value={dataFilter.source || undefined}
                                allowClear
                                onChange={(value) =>
                                    onChangeFilter({
                                        source: value || undefined,
                                    })
                                }
                                options={[
                                    {
                                        value: 'ftp_folder',
                                        label: messages('dspReport.source.ftp_folder'),
                                    },
                                    {
                                        value: 'wmg_report',
                                        label: messages('dspReport.source.wmg_report'),
                                    },
                                    {
                                        value: 'spotify_report',
                                        label: messages('dspReport.source.spotify_report'),
                                    },
                                ]}
                            />
                            <Select
                                className="w-52"
                                placeholder={messages('common.status')}
                                value={dataFilter.status || undefined}
                                allowClear
                                onChange={(value) =>
                                    onChangeFilter({
                                        status: value || undefined,
                                    })
                                }
                                options={[
                                    { value: 'assigned', label: messages('dspReport.status.assigned') },
                                    {
                                        value: 'unassigned',
                                        label: messages('dspReport.status.unassigned'),
                                    },
                                ]}
                            />
                        </Space>
                    }
                    toolBarRender={() => [
                        <Button
                            key="ftp-file-discovery-runs"
                            icon={<History size={SIZE_ICON} />}
                            onClick={() => setIsDiscoveryRunsModalOpen(true)}
                        >
                            {messages('dspReport.fileDiscoveryRuns.button')}
                        </Button>,
                    ]}
                    options={{
                        reload: () => refetch(),
                    }}
                />
                <AppPagination
                    align="end"
                    className="rounded-b-lg"
                    style={{
                        backgroundColor: token?.colorBgContainer,
                    }}
                    current={dspReportData.metadata.page}
                    pageSize={dataFilter.pageSize}
                    total={dspReportData.metadata.totalItems}
                    onChange={onChangePage}
                    showTotalText
                    showSizeChanger
                    showQuickJumper
                    pageSizeOptions={PAGE_SIZE_OPTIONS}
                />
                {isDiscoveryRunsModalOpen && (
                    <FtpFileDiscoveryRunsModal
                        open={isDiscoveryRunsModalOpen}
                        onCancel={() => setIsDiscoveryRunsModalOpen(false)}
                    />
                )}
            </PageContainer>
        </AppPageWrapper>
    );
}
