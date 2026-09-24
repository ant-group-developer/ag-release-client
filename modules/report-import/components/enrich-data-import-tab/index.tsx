import AppPagination from '@/components/ui/pagination';
import { PAGE_SIZE_OPTIONS } from '@/constants/page-size';
import { useFilter } from '@/hooks/use-filter';
import { ScanOutlined, SyncOutlined } from '@ant-design/icons';
import { Button, theme, Typography } from 'antd';
import { useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';
import { ENRICH_SCAN_STATUS } from '../../enums';
import { useEnrichScanEvents } from '../../hooks/use-enrich-scan-events';
import { useGetListEnrichScanSessions } from '../../hooks/use-get-list-enrich-scan-sessions';
import { EnrichScanSessionData } from '../../types/payload';
import EnrichHistoryModal from './enrich-history-modal';
import EnrichScanModal from './enrich-scan-modal';
import EnrichScanSessionsTable from './enrich-scan-sessions-table';

export default function EnrichDataImportTab() {
    const messages = useTranslations();
    const { token } = theme.useToken();

    const { dataFilter, onChangePage } = useFilter({
        page: 1,
        pageSize: 10,
    });
    const [isScanModalOpen, setIsScanModalOpen] = useState(false);
    const [viewScanId, setViewScanId] = useState<string | null>(null);
    const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
    const [historyScanId, setHistoryScanId] = useState<string | null>(null);

    const { enrichScanSessionsData, isLoading, isFetching, refetch } =
        useGetListEnrichScanSessions(dataFilter);

    const runningScanSession = useMemo(() => {
        return enrichScanSessionsData.items.find(
            (item) =>
                item.status !== ENRICH_SCAN_STATUS.COMPLETED &&
                item.status !== ENRICH_SCAN_STATUS.FAILED
        );
    }, [enrichScanSessionsData.items]);

    const hasRunningScanSession = !!runningScanSession;

    useEnrichScanEvents({
        scanId: runningScanSession?.id,
        enabled: !!runningScanSession?.id && !isScanModalOpen,
    });

    const handleOpenScanModal = () => {
        setViewScanId(null);
        setIsScanModalOpen(true);
    };

    const handleViewDetail = (record: EnrichScanSessionData) => {
        setViewScanId(record.id);
        setIsScanModalOpen(true);
    };

    const handleCloseScanModal = () => {
        setIsScanModalOpen(false);
        setViewScanId(null);
    };

    const handleViewHistory = (record: EnrichScanSessionData) => {
        setHistoryScanId(record.id);
        setIsHistoryModalOpen(true);
    };

    const handleCloseHistoryModal = () => {
        setIsHistoryModalOpen(false);
        setHistoryScanId(null);
    };

    return (
        <div>
            <EnrichScanSessionsTable
                title={() => (
                    <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <Typography.Text strong className="text-sm">
                            {messages(
                                'reportConfigs.enrichDataImport.recentSessionsTitle'
                            )}
                        </Typography.Text>
                        <div className="flex flex-wrap items-center gap-2">
                            <Button
                                icon={<SyncOutlined />}
                                onClick={() => refetch()}
                                loading={isFetching}
                            >
                                {messages('common.refresh')}
                            </Button>
                            <Button
                                type="primary"
                                icon={<ScanOutlined />}
                                onClick={handleOpenScanModal}
                            >
                                {messages(
                                    'reportConfigs.enrichDataImport.scanButton'
                                )}
                            </Button>
                        </div>
                    </div>
                )}
                sticky
                dataSource={enrichScanSessionsData.items}
                loading={isLoading}
                pagination={{
                    pageSize: dataFilter.pageSize ?? 10,
                    current: enrichScanSessionsData.metadata.page,
                }}
                onChange={() => undefined}
                onViewDetail={handleViewDetail}
                onViewHistory={handleViewHistory}
            />
            <AppPagination
                style={{
                    backgroundColor: token.colorBgContainer,
                }}
                align="end"
                current={enrichScanSessionsData.metadata.page}
                pageSize={dataFilter.pageSize}
                total={enrichScanSessionsData.metadata.totalItems}
                onChange={onChangePage}
                showTotalText
                showSizeChanger
                showQuickJumper
                pageSizeOptions={PAGE_SIZE_OPTIONS}
            />
            <EnrichScanModal
                open={isScanModalOpen}
                onClose={handleCloseScanModal}
                initialScanId={viewScanId}
            />
            <EnrichHistoryModal
                open={isHistoryModalOpen}
                onClose={handleCloseHistoryModal}
                scanId={historyScanId}
            />
        </div>
    );
}
