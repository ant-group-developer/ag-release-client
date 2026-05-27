'use client';

import { useQueryClient } from '@tanstack/react-query';
import { App } from 'antd';
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';
import { analytics2QueryKeys } from '../constants/query-keys';
import { SYNC_JOB_STATUS } from '../enums/sync-job';
import { useGetSyncJob } from '../hooks/use-get-sync-job';
import { useSyncJobStore } from '../store/use-sync-job-store';

export default function SyncJobMonitor() {
    const queryClient = useQueryClient();
    const { message } = App.useApp();
    const messages = useTranslations();
    const { jobId, status, updateJob, clearJob } = useSyncJobStore();
    const shouldPoll =
        !!jobId &&
        (status === SYNC_JOB_STATUS.PENDING || status === SYNC_JOB_STATUS.RUNNING);

    const { data, isError } = useGetSyncJob({
        jobId,
        enabled: shouldPoll,
    });

    useEffect(() => {
        const job = data?.data as Record<string, unknown> | undefined;
        if (!job) return;
        if (job.error || !job.status) {
            message.error(messages('analytics2.syncAll.jobNotFound'));
            clearJob();
            return;
        }

        updateJob(data!.data);

        if (job.status === SYNC_JOB_STATUS.DONE) {
            message.success(messages('analytics2.syncAll.completed'));
            queryClient.invalidateQueries({ queryKey: analytics2QueryKeys.all });
            clearJob();
            return;
        }

        if (job.status === SYNC_JOB_STATUS.ERROR) {
            message.error(messages('analytics2.syncAll.failed'));
            clearJob();
        }
    }, [clearJob, data, message, messages, queryClient, updateJob]);

    useEffect(() => {
        if (!isError) return;
        message.error(messages('analytics2.syncAll.jobNotFound'));
        clearJob();
    }, [isError, clearJob, message, messages]);

    return null;
}
