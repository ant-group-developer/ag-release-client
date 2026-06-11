import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { theme } from 'antd';
import { useQueryClient } from '@tanstack/react-query';
import { PAGE_SIZE, PAGE_SIZE_OPTIONS } from '@/constants/page-size';
import AppPagination from '@/components/ui/pagination';
import CreateButton from '@/components/ui/button/create-button';
import { ImportModal } from './import-form-modal';
import EtlJobsTable from './etl-jobs-table';
import { useGetListEtlJobs } from '../../hooks/use-get-list-etl-jobs';
import { etlJobQueryKeys } from '../../constants/query-keys';
import { EtlJobData } from '../../types/payload';

export default function ImportTab() {
    const messages = useTranslations();
    const { token } = theme.useToken();
    const queryClient = useQueryClient();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [viewJobId, setViewJobId] = useState<string | null>(null);

    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(PAGE_SIZE);

    const { etlJobsData, isLoading } = useGetListEtlJobs({
        page,
        pageSize,
    });

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setViewJobId(null);
        queryClient.invalidateQueries({ queryKey: etlJobQueryKeys.all });
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
        <div style={{ padding: '24px 0' }}>
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
                        <span style={{ fontSize: 16, fontWeight: 600 }}>
                            {messages('reportConfigs.importResult.recentJobsTitle')}
                        </span>
                        <CreateButton
                            text={messages('reportConfigs.importReportBtn')}
                            onClick={() => {
                                setViewJobId(null);
                                setIsModalOpen(true);
                            }}
                        />
                    </div>
                )}
                sticky
                dataSource={etlJobsData.items}
                loading={isLoading}
                pagination={{
                    pageSize,
                    current: etlJobsData.metadata.page,
                }}
                scroll={{ x: 1200 }}
                onViewDetail={handleViewDetail}
                onChange={() => undefined}
            />
            <AppPagination
                style={{ backgroundColor: token.colorBgContainer, marginTop: 16 }}
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
