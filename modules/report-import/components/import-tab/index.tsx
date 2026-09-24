import CreateButton from '@/components/ui/button/create-button';
import AppPagination from '@/components/ui/pagination';
import { PAGE_SIZE_OPTIONS } from '@/constants/page-size';
import { SyncOutlined } from '@ant-design/icons';
import { Button, Select, theme, Typography } from 'antd';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { REPORT_SOURCE } from '../../enums';
import { useGetListEtlJobs } from '../../hooks/use-get-list-etl-jobs';
import { EtlJobData } from '../../types/payload';
import EtlJobsTable from './etl-jobs-table';
import { EtlJobStatusDetailModal } from './etl-job-status-detail-modal';
import { ImportModal } from './import-form-modal';

export default function ImportTab() {
    const messages = useTranslations();
    const { token } = theme.useToken();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [viewJobId, setViewJobId] = useState<string | null>(null);

    const [isStatusDetailOpen, setIsStatusDetailOpen] = useState(false);
    const [statusDetailJobId, setStatusDetailJobId] = useState<string | null>(null);

    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [reportSource, setReportSource] = useState<REPORT_SOURCE | null>(null);

    const { etlJobsData, isLoading, isFetching, refetch } = useGetListEtlJobs({
        page,
        pageSize,
        ...(reportSource ? { reportSource } : {}),
    });

    const reportSourceOptions = [
        { label: messages('common.all'), value: null },
        { label: 'Merlin', value: REPORT_SOURCE.MERLIN },
        { label: 'Spotify', value: REPORT_SOURCE.SPOTIFY },
        { label: 'Warner', value: REPORT_SOURCE.WARNER },
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
                    <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <Typography.Text strong className="text-sm">
                            {messages(
                                'reportConfigs.importResult.recentJobsTitle'
                            )}
                        </Typography.Text>
                        <div className="flex flex-wrap items-center gap-2">
                            <Select
                                allowClear
                                placeholder={messages('reportConfigs.source')}
                                value={reportSource}
                                onChange={(value) => {
                                    setReportSource(value ?? null);
                                    setPage(1);
                                }}
                                options={reportSourceOptions}
                                className="min-w-[140px] flex-1 sm:flex-initial"
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
