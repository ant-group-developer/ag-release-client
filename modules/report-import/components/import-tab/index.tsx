import CreateButton from '@/components/ui/button/create-button';
import AppPagination from '@/components/ui/pagination';
import { PAGE_SIZE_OPTIONS } from '@/constants/page-size';
import { SyncOutlined } from '@ant-design/icons';
import { Button, Select, theme } from 'antd';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { ETL_JOB_SOURCE_TYPE, REPORT_SOURCE } from '../../enums';
import { useGetListEtlJobs } from '../../hooks/use-get-list-etl-jobs';
import { EtlJobData } from '../../types/payload';
import { EtlJobStatusDetailModal } from './etl-job-status-detail-modal';
import EtlJobsTable from './etl-jobs-table';
import { ImportModal } from './import-form-modal';

export default function ImportTab() {
    const messages = useTranslations();
    const { token } = theme.useToken();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [viewJobId, setViewJobId] = useState<string | null>(null);

    const [isStatusDetailOpen, setIsStatusDetailOpen] = useState(false);
    const [statusDetailJobId, setStatusDetailJobId] = useState<string | null>(
        null
    );

    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [reportSource, setReportSource] = useState<REPORT_SOURCE | null>(
        null
    );
    const [sourceType, setSourceType] = useState<
        ETL_JOB_SOURCE_TYPE | '' | null
    >(null);

    const { etlJobsData, isLoading, isFetching, refetch } = useGetListEtlJobs({
        page,
        pageSize,
        ...(reportSource ? { reportSource } : {}),
        ...(sourceType ? { sourceType } : {}),
    });

    const reportSourceOptions = [
        { label: messages('common.all'), value: null },
        { label: 'Merlin', value: REPORT_SOURCE.MERLIN },
        { label: 'Spotify', value: REPORT_SOURCE.SPOTIFY },
        { label: 'Warner', value: REPORT_SOURCE.WARNER },
    ];

    const sourceTypeOptions = [
        {
            label: messages(
                'reportConfigs.importResult.sourceTypeAnalyticsReportExport'
            ),
            value: ETL_JOB_SOURCE_TYPE.ANALYTICS_REPORT_EXPORT,
        },
        { label: 'Report', value: '' },
    ];

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setViewJobId(null);
    };

    const handleViewDetail = (record: EtlJobData) => {
        setViewJobId(record.id);
        setIsModalOpen(true);
    };

    const onChangePage = (newPage: number, newPageSize: number) => {
        setPage(newPage);
        setPageSize(newPageSize);
    };

    return (
        <div>
            <EtlJobsTable
                title={() => (
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            width: '100%',
                        }}
                    >
                        <span style={{ fontSize: 14, fontWeight: 600 }}>
                            {messages(
                                'reportConfigs.importResult.recentJobsTitle'
                            )}
                        </span>
                        <div
                            style={{
                                display: 'flex',
                                gap: 8,
                                alignItems: 'center',
                            }}
                        >
                            <Select
                                allowClear
                                placeholder={messages('reportConfigs.source')}
                                value={reportSource}
                                onChange={(value) => {
                                    setReportSource(value ?? null);
                                    setPage(1);
                                }}
                                options={reportSourceOptions}
                                style={{ minWidth: 140 }}
                            />
                            <Select
                                allowClear
                                placeholder={messages(
                                    'reportConfigs.importResult.sourceType'
                                )}
                                value={sourceType}
                                onChange={(value) => {
                                    setSourceType(value ?? null);
                                    setPage(1);
                                }}
                                options={sourceTypeOptions}
                                style={{ minWidth: 240 }}
                            />
                            <Button
                                icon={<SyncOutlined />}
                                onClick={() => refetch()}
                                loading={isFetching}
                            >
                                {messages('common.refresh')}
                            </Button>
                            <CreateButton
                                text={messages('reportConfigs.importReportBtn')}
                                onClick={() => {
                                    setViewJobId(null);
                                    setIsModalOpen(true);
                                }}
                            />
                        </div>
                    </div>
                )}
                sticky
                dataSource={etlJobsData.items}
                loading={isLoading}
                pagination={{
                    pageSize,
                    current: etlJobsData.metadata.page,
                }}
                onViewDetail={handleViewDetail}
                onViewStatusDetail={(record) => {
                    setStatusDetailJobId(record.id);
                    setIsStatusDetailOpen(true);
                }}
                onChange={() => undefined}
                scroll={{
                    x: 'max-content',
                }}
            />
            <AppPagination
                style={{
                    backgroundColor: token.colorBgContainer,
                }}
                align="end"
                current={etlJobsData.metadata.page}
                pageSize={pageSize}
                total={etlJobsData.metadata.totalItems}
                onChange={onChangePage}
                showTotalText
                showSizeChanger
                showQuickJumper
                pageSizeOptions={PAGE_SIZE_OPTIONS}
            />
            <ImportModal
                open={isModalOpen}
                onClose={handleCloseModal}
                viewJobId={viewJobId}
            />
            <EtlJobStatusDetailModal
                open={isStatusDetailOpen}
                onClose={() => {
                    setIsStatusDetailOpen(false);
                    setStatusDetailJobId(null);
                }}
                jobId={statusDetailJobId}
            />
        </div>
    );
}
