import CreateButton from '@/components/ui/button/create-button';
import AppPagination from '@/components/ui/pagination';
import { PAGE_SIZE_OPTIONS } from '@/constants/page-size';
import { SyncOutlined } from '@ant-design/icons';
import { Button, theme } from 'antd';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { useGetListEtlJobs } from '../../hooks/use-get-list-etl-jobs';
import { EtlJobData } from '../../types/payload';
import EtlJobsTable from './etl-jobs-table';
import { ImportModal } from './import-form-modal';

export default function ImportTab() {
    const messages = useTranslations();
    const { token } = theme.useToken();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [viewJobId, setViewJobId] = useState<string | null>(null);

    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const { etlJobsData, isLoading, isFetching, refetch } = useGetListEtlJobs({
        page,
        pageSize,
    });

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
                onChange={() => undefined}
                scroll={{
                    y: 500,
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
        </div>
    );
}
