'use client';

import { showNotification } from '@/helpers/messages-helper';
import useModalStore from '@/hooks/use-modal';
import { Button, Drawer, Typography } from 'antd';
import { Download } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect, useRef, useState } from 'react';
import { AssetImportBatchStatus, TYPE_MODAL_ASSET_IMPORT } from '../../enums';
import { useAssetImportBatchEvents } from '../../hooks/use-asset-import-events';
import { useGetAssetImportBatch } from '../../hooks/use-get-batch';
import { useGetMergeImpact } from '../../hooks/use-get-merge-impact';
import { AssetImportBatchData } from '../../types';
import { MergeDuplicatesResult } from '../../types/payload';
import BatchStatusTag from '../tag/batch-status-tag';
import ApplyProgress from './apply-progress';
import BatchSummary from './batch-summary';
import ItemsTable from './items-table';
import MergePanel from './merge-panel';

export default function AssetImportDetailDrawer() {
    const messages = useTranslations();
    const typeModal = useModalStore((state) => state.typeModal);
    const dataEdit = useModalStore<AssetImportBatchData>(
        (state) => state.dataEdit
    );
    const closeModal = useModalStore((state) => state.closeModal);

    const open = typeModal === TYPE_MODAL_ASSET_IMPORT.DETAIL;
    const batchId = dataEdit?.id;

    // dataEdit is a static snapshot taken when the drawer opens (from the row
    // that was clicked). Once an apply starts, the batch status changes on the
    // server but dataEdit never updates, so we track a local "live" status that
    // reacts to SSE events (and is optimistically bumped when apply is triggered).
    const [liveStatus, setLiveStatus] = useState<string | null | undefined>(
        dataEdit?.status
    );
    const [settledTick, setSettledTick] = useState(0);
    // Ignore a stale SCANNED poll only until the server has actually been APPLYING,
    // or the job emits a terminal event.
    const acceptSettledStatusRef = useRef(false);
    const sawServerApplyingRef = useRef(false);

    useEffect(() => {
        if (open) {
            acceptSettledStatusRef.current = false;
            sawServerApplyingRef.current = false;
            setLiveStatus(dataEdit?.status);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, batchId]);

    const { batchDetail } = useGetAssetImportBatch(batchId, open);
    const mergeRequired = batchDetail?.summary?.byAction?.MERGE_REQUIRED ?? 0;
    const conflictCount = batchDetail?.summary?.byAction?.CONFLICT ?? 0;
    const { mergeImpact, isFetching: impactLoading } = useGetMergeImpact(
        batchId,
        open && mergeRequired > 0
    );

    const settleRunningStatus = () => {
        acceptSettledStatusRef.current = true;
        setSettledTick((value) => value + 1);
    };

    const { summary, latestEvent, isListening } = useAssetImportBatchEvents({
        batchId,
        enabled:
            open &&
            !!batchId &&
            liveStatus === AssetImportBatchStatus.APPLYING,
        onCompleted: (eventData) => {
            settleRunningStatus();
            if (eventData.sourceType !== 'ASSET_IMPORT_MERGE') return;
            const result = eventData.result as MergeDuplicatesResult | undefined;
            if (!result || typeof result.merged !== 'number') return;
            const text = messages('assetImport.merge.mergeResult', {
                merged: result.merged,
                failed: result.failed,
                rescanned: result.rescanned,
            });
            showNotification(result.failed > 0 ? 'warning' : 'success', text);
        },
        onFailed: (eventData) => {
            settleRunningStatus();
            const error = eventData.error || eventData.message;
            if (eventData.sourceType === 'ASSET_IMPORT_MERGE' && error) {
                showNotification(
                    'error',
                    messages('assetImport.merge.jobFailed', {
                        error: String(error),
                    })
                );
            }
        },
    });

    useEffect(() => {
        if (!batchDetail?.status) return;
        if (batchDetail.status === AssetImportBatchStatus.APPLYING) {
            sawServerApplyingRef.current = true;
        }
        setLiveStatus((current) => {
            // Detail can still say SCANNED for a moment after a job starts.
            // Once the server has reported APPLYING, a later SCANNED is real.
            if (
                current === AssetImportBatchStatus.APPLYING &&
                batchDetail.status === AssetImportBatchStatus.SCANNED &&
                !acceptSettledStatusRef.current &&
                !sawServerApplyingRef.current
            ) {
                return current;
            }
            return batchDetail.status;
        });
    }, [batchDetail?.status, settledTick]);

    useEffect(() => {
        if (summary?.status) {
            setLiveStatus(summary.status);
        }
    }, [summary?.status]);

    const handleJobStart = () => {
        acceptSettledStatusRef.current = false;
        sawServerApplyingRef.current = false;
        setLiveStatus(AssetImportBatchStatus.APPLYING);
    };

    const canOperate =
        liveStatus === AssetImportBatchStatus.SCANNED ||
        liveStatus === AssetImportBatchStatus.PARTIALLY_APPLIED;
    const downloadUrl = batchDetail?.downloadUrl || dataEdit?.downloadUrl;

    return (
        <Drawer
            open={open}
            onClose={closeModal}
            width="100vw"
            destroyOnHidden
            title={
                <div className="flex items-center gap-2">
                    <Typography.Text
                        ellipsis={{ tooltip: dataEdit?.fileName }}
                        className="!mb-0 max-w-md"
                    >
                        {dataEdit?.fileName}
                    </Typography.Text>
                    <BatchStatusTag status={liveStatus} />
                    <Button
                        className="shrink-0"
                        icon={<Download size={16} />}
                        disabled={!downloadUrl}
                        onClick={() => {
                            if (!downloadUrl) return;
                            window.open(
                                downloadUrl,
                                '_blank',
                                'noopener,noreferrer'
                            );
                        }}
                    >
                        {messages('assetImport.batch.downloadFile')}
                    </Button>
                </div>
            }
        >
            {dataEdit && (
                <>
                    <BatchSummary summary={batchDetail?.summary} />
                    <ApplyProgress
                        status={liveStatus}
                        summary={summary}
                        latestEvent={latestEvent}
                        isListening={isListening}
                    />
                    <MergePanel
                        batchId={batchId}
                        canOperate={canOperate}
                        mergeRequired={mergeRequired}
                        conflictCount={conflictCount}
                        impact={mergeImpact}
                        impactLoading={impactLoading}
                        onMergeStart={handleJobStart}
                    />
                    <ItemsTable
                        open={open}
                        batchId={batchId}
                        batchStatus={liveStatus}
                        waitForItems={dataEdit.waitForItems}
                        onApplyStart={handleJobStart}
                        unresolvedMergeCount={mergeRequired}
                        unresolvedConflictCount={conflictCount}
                        impact={mergeImpact}
                    />
                </>
            )}
        </Drawer>
    );
}
