'use client';

import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { SYNC_JOB_STATUS } from '../enums/sync-job';
import { SyncJobProgress, SyncJobResponse } from '../types';

type SyncJobState = {
    jobId?: string;
    status?: SYNC_JOB_STATUS;
    progress?: SyncJobProgress;
    startedAt?: string;
    setJob: (job: { jobId: string; status: SYNC_JOB_STATUS }) => void;
    updateJob: (job: SyncJobResponse) => void;
    clearJob: () => void;
};

const normalizeStatus = (status: string): SYNC_JOB_STATUS => {
    if (status === SYNC_JOB_STATUS.DONE) return SYNC_JOB_STATUS.DONE;
    if (status === SYNC_JOB_STATUS.ERROR) return SYNC_JOB_STATUS.ERROR;
    if (status === SYNC_JOB_STATUS.RUNNING) return SYNC_JOB_STATUS.RUNNING;
    return SYNC_JOB_STATUS.PENDING;
};

export const useSyncJobStore = create<SyncJobState>()(
    persist(
        (set) => ({
            jobId: undefined,
            status: undefined,
            progress: undefined,
            startedAt: undefined,
            setJob: ({ jobId, status }) =>
                set({
                    jobId,
                    status,
                    progress: undefined,
                    startedAt: new Date().toISOString(),
                }),
            updateJob: (job) =>
                set({
                    jobId: job.id,
                    status: normalizeStatus(job.status),
                    progress: job.progress,
                    startedAt: job.startedAt,
                }),
            clearJob: () =>
                set({
                    jobId: undefined,
                    status: undefined,
                    progress: undefined,
                    startedAt: undefined,
                }),
        }),
        {
            name: 'analytics2-sync-job',
            storage: createJSONStorage(() => localStorage),
        }
    )
);
