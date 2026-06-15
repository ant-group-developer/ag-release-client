import AppPagination from '@/components/ui/pagination';
import { PAGE_SIZE_OPTIONS } from '@/constants/page-size';
import { ScanOutlined, SyncOutlined } from '@ant-design/icons';
import { Button, theme } from 'antd';
import { useTranslations } from 'next-intl';
import { useCallback, useMemo, useState } from 'react';
import { ENRICH_SCAN_STATUS } from '../../enums';
import { useEnrichScanEvents } from '../../hooks/use-enrich-scan-events';
import { useGetListEnrichScanSessions } from '../../hooks/use-get-list-enrich-scan-sessions';
import {
    EnrichScanEventData,
    EnrichScanSessionData,
} from '../../types/payload';
import EnrichScanModal from './enrich-scan-modal';
import EnrichScanSessionsTable from './enrich-scan-sessions-table';

const DEFAULT_ENRICH_SCAN_SESSION_PAGE = 1;
const DEFAULT_ENRICH_SCAN_SESSION_PAGE_SIZE = 10;

export default function EnrichDataImportTab() {
    const messages = useTranslations();
    const { token } = theme.useToken();

    const [page, setPage] = useState(DEFAULT_ENRICH_SCAN_SESSION_PAGE);
    const [pageSize, setPageSize] = useState(
        DEFAULT_ENRICH_SCAN_SESSION_PAGE_SIZE
    );
    const [isScanModalOpen, setIsScanModalOpen] = useState(false);
    const [viewScanId, setViewScanId] = useState<string | null>(null);

    const { enrichScanSessionsData, isLoading, isFetching, refetch } =
        useGetListEnrichScanSessions({
            page,
            pageSize,
        });

    const runningScanSession = useMemo(() => {
        return enrichScanSessionsData.items.find(
            (item) =>
                item.status !== ENRICH_SCAN_STATUS.COMPLETED &&
                item.status !== ENRICH_SCAN_STATUS.FAILED
        );
    }, [enrichScanSessionsData.items]);

    const hasRunningScanSession = !!runningScanSession;

    const handleScanEventDone = useCallback(
        (_eventData: EnrichScanEventData) => {
            refetch();
        },
        [refetch]
    );

    useEnrichScanEvents({
        scanId: runningScanSession?.id,
        enabled: !!runningScanSession?.id,
        onCompleted: handleScanEventDone,
        onFailed: handleScanEventDone,
    });

    const onChangePage = (newPage: number, newPageSize: number) => {
        setPage(newPage);
        setPageSize(newPageSize);
    };

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

    return (
        <div>
            <EnrichScanSessionsTable
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
                                'reportConfigs.enrichDataImport.recentSessionsTitle'
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
                            <Button
                                type="primary"
                                icon={<ScanOutlined />}
                                onClick={handleOpenScanModal}
                                disabled={hasRunningScanSession}
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
                    pageSize,
                    current: enrichScanSessionsData.metadata.page,
                }}
                onChange={() => undefined}
                onViewDetail={handleViewDetail}
            />
            <AppPagination
                style={{
                    backgroundColor: token.colorBgContainer,
                }}
                align="end"
                current={enrichScanSessionsData.metadata.page}
                pageSize={pageSize}
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
        </div>
    );
}
