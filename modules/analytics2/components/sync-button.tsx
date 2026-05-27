'use client';

import { App, Button, DatePicker, Modal, Select, Switch, Tooltip } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { SYNC_JOB_STATUS } from '../enums/sync-job';
import { useStartSync } from '../hooks/use-start-sync';
import { useStartSyncAll } from '../hooks/use-start-sync-all';
import { useSyncJobStore } from '../store/use-sync-job-store';
import { SyncAllResponse } from '../types';

const PERIOD_FORMAT = 'YYYYMM';
const DISPLAY_FORMAT = 'MM/YYYY';

type SyncMode = 'single' | 'from';

export default function SyncAllButton() {
    const { message } = App.useApp();
    const messages = useTranslations();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [syncMode, setSyncMode] = useState<SyncMode>('single');
    const [period, setPeriod] = useState<Dayjs | null>(dayjs());
    const [force, setForce] = useState(false);

    const { jobId, status, progress, setJob } = useSyncJobStore();
    const { mutate: mutateSync, isPending: isSyncPending } = useStartSync();
    const { mutate: mutateSyncAll, isPending: isSyncAllPending } =
        useStartSyncAll();

    const isPending = isSyncPending || isSyncAllPending;
    const isSyncing =
        !!jobId &&
        (status === SYNC_JOB_STATUS.PENDING ||
            status === SYNC_JOB_STATUS.RUNNING);

    const syncModeOptions = [
        {
            value: 'single',
            label: messages('analytics2.syncAll.syncModeSingle'),
        },
        { value: 'from', label: messages('analytics2.syncAll.syncModeFrom') },
    ];

    const handleOpen = () => {
        if (isSyncing) return;
        setIsModalOpen(true);
    };

    const handleCancel = () => {
        if (isPending) return;
        setIsModalOpen(false);
    };

    const handleModeChange = (mode: SyncMode) => {
        setSyncMode(mode);
        setPeriod(dayjs());
    };

    const onSuccess = ({ data }: { data: SyncAllResponse }) => {
        setJob({ jobId: data.jobId, status: SYNC_JOB_STATUS.PENDING });
        setIsModalOpen(false);
        message.success(messages('analytics2.syncAll.started'));
    };

    const onError = () => {
        message.error(messages('analytics2.syncAll.startFailed'));
    };

    const handleAccept = () => {
        if (!period) return;

        if (syncMode === 'single') {
            mutateSync(
                { period: period.format(PERIOD_FORMAT), force },
                { onSuccess, onError }
            );
        } else {
            mutateSyncAll(
                { startPeriod: period.format(PERIOD_FORMAT), force },
                { onSuccess, onError }
            );
        }
    };

    const periodLabel =
        syncMode === 'single'
            ? messages('analytics2.syncAll.period')
            : messages('analytics2.syncAll.startPeriod');

    return (
        <>
            <Tooltip
                title={isSyncing ? messages('analytics2.syncAll.syncing') : undefined}
            >
                <span
                    style={{
                        display: 'inline-flex',
                        cursor: isSyncing ? 'not-allowed' : undefined,
                    }}
                >
                    <Button
                        type="primary"
                        loading={isSyncing || isPending}
                        onClick={handleOpen}
                        style={{ pointerEvents: isSyncing ? 'none' : undefined }}
                    >
                        {messages('analytics2.syncAll.button')}
                    </Button>
                </span>
            </Tooltip>
            <Modal
                title={messages('analytics2.syncAll.modalTitle')}
                open={isModalOpen}
                onCancel={handleCancel}
                onOk={handleAccept}
                okText={messages('analytics2.syncAll.accept')}
                cancelText={messages('analytics2.syncAll.cancel')}
                confirmLoading={isPending}
                okButtonProps={{ disabled: !period }}
            >
                <div className="flex flex-col gap-4 py-2">
                    {/* Sync mode dropdown */}
                    <div className="flex flex-col gap-1">
                        <span className="text-sm font-medium">
                            {messages('analytics2.syncAll.syncMode')}
                        </span>
                        <Select
                            value={syncMode}
                            options={syncModeOptions}
                            onChange={handleModeChange}
                            className="w-full"
                        />
                    </div>

                    {/* Month picker */}
                    <div className="flex flex-col gap-1">
                        <span className="text-sm font-medium">
                            {periodLabel}
                        </span>
                        <DatePicker
                            picker="month"
                            allowClear={false}
                            format={DISPLAY_FORMAT}
                            value={period}
                            onChange={setPeriod}
                            className="w-full"
                            placeholder={periodLabel}
                        />
                    </div>

                    {/* Force switch */}
                    <div className="flex items-center gap-2">
                        <Switch
                            checked={force}
                            onChange={setForce}
                            id="sync-force-switch"
                        />
                        <Tooltip
                            title={messages('analytics2.syncAll.forceTooltip')}
                        >
                            <span className="cursor-help text-sm font-medium">
                                {messages('analytics2.syncAll.force')}
                            </span>
                        </Tooltip>
                    </div>
                </div>
            </Modal>
        </>
    );
}
