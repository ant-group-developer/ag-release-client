'use client';

import useModalStore from '@/hooks/use-modal';
import { Drawer, Typography } from 'antd';
import { useEffect, useState } from 'react';
import { AssetImportBatchStatus, TYPE_MODAL_ASSET_IMPORT } from '../../enums';
import { useAssetImportBatchEvents } from '../../hooks/use-asset-import-events';
import { AssetImportBatchData } from '../../types';
import BatchStatusTag from '../tag/batch-status-tag';
import ApplyProgress from './apply-progress';
import ItemsTable from './items-table';

export default function AssetImportDetailDrawer() {
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

    useEffect(() => {
        if (open) {
            setLiveStatus(dataEdit?.status);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, batchId]);

    const { summary, isListening } = useAssetImportBatchEvents({
        batchId,
        enabled:
            open &&
            !!batchId &&
            liveStatus === AssetImportBatchStatus.APPLYING,
    });

    useEffect(() => {
        if (summary?.status) {
            setLiveStatus(summary.status);
        }
    }, [summary?.status]);

    const handleApplyStart = () => {
        setLiveStatus(AssetImportBatchStatus.APPLYING);
    };

    return (
        <Drawer
            open={open}
            onClose={closeModal}
            width="90vw"
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
                </div>
            }
        >
            {dataEdit && (
                <>
                    <ApplyProgress
                        status={liveStatus}
                        summary={summary}
                        isListening={isListening}
                    />
                    <ItemsTable
                        open={open}
                        batchId={batchId}
                        batchStatus={liveStatus}
                        onApplyStart={handleApplyStart}
                    />
                </>
            )}
        </Drawer>
    );
}
