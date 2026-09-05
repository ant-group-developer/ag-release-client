'use client';

import { create } from 'zustand';
import { ExportReportJob } from '../types';

interface ExportJobStore {
    jobs: ExportReportJob[];
    isProgressOpen: boolean;
    addJob: (jobId: string) => void;
    removeJob: (jobId: string) => void;
    clearJobs: () => void;
    setIsProgressOpen: (isOpen: boolean) => void;
}

export const useExportJobStore = create<ExportJobStore>((set) => ({
    jobs: [],
    isProgressOpen: false,
    addJob: (jobId: string) =>
        set((state) => {
            if (state.jobs.some((job) => job.id === jobId)) {
                return { isProgressOpen: true };
            }
            return {
                jobs: [
                    ...state.jobs,
                    {
                        id: jobId,
                        createdAt: Date.now(),
                    },
                ],
                isProgressOpen: true,
            };
        }),
    removeJob: (jobId: string) =>
        set((state) => {
            const nextJobs = state.jobs.filter((job) => job.id !== jobId);
            return {
                jobs: nextJobs,
                isProgressOpen: nextJobs.length > 0 ? state.isProgressOpen : false,
            };
        }),
    clearJobs: () =>
        set({
            jobs: [],
            isProgressOpen: false,
        }),
    setIsProgressOpen: (isOpen: boolean) =>
        set({
            isProgressOpen: isOpen,
        }),
}));
