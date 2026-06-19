'use client';

import { cn } from '@/helpers/common';
import {
    EXPORT_REPORT_JOB_STATUS,
    EXPORT_REPORT_PROGRESS_POPOVER,
} from '@/modules/analytics2/constants/export-report';
import { ExportReportJob } from '@/modules/analytics2/types';
import { Card, List, Space, theme, Typography } from 'antd';
import { ChevronDown, ChevronUp, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useCallback, useState } from 'react';
import ExportReportProgressItem from './export-report-progress-item';
import { ExportReportJobStatus } from './types';

interface ExportReportProgressPopoverProps {
    jobs: ExportReportJob[];
    onClose: () => void;
    onRemoveJob: (jobId: string) => void;
}

export default function ExportReportProgressPopover({
    jobs,
    onClose,
    onRemoveJob,
}: ExportReportProgressPopoverProps) {
    const messages = useTranslations();
    const { token } = theme.useToken();
    const [isExpanded, setIsExpanded] = useState(true);
    const [statusByJobId, setStatusByJobId] = useState<
        Record<string, ExportReportJobStatus>
    >({});

    const handleStatusChange = useCallback(
        (jobId: string, status: ExportReportJobStatus) => {
            setStatusByJobId((prevStatusByJobId) => {
                if (prevStatusByJobId[jobId] === status) {
                    return prevStatusByJobId;
                }

                return {
                    ...prevStatusByJobId,
                    [jobId]: status,
                };
            });
        },
        []
    );

    const handleRemoveJob = useCallback(
        (jobId: string) => {
            setStatusByJobId((prevStatusByJobId) => {
                const nextStatusByJobId = { ...prevStatusByJobId };
                delete nextStatusByJobId[jobId];

                return nextStatusByJobId;
            });
            onRemoveJob(jobId);
        },
        [onRemoveJob]
    );

    const jobStatuses = jobs.map(
        (job) => statusByJobId[job.id] || EXPORT_REPORT_JOB_STATUS.RUNNING
    );
    const isAllCompleted = jobStatuses.every(
        (status) => status === EXPORT_REPORT_JOB_STATUS.COMPLETED
    );
    const hasRunningJob = jobStatuses.some(
        (status) => status === EXPORT_REPORT_JOB_STATUS.RUNNING
    );
    const title = isAllCompleted
        ? messages('common.downloadReady')
        : !hasRunningJob
          ? messages('common.exportReportFailed')
          : messages('common.preparingDownload');

    if (!jobs.length) return null;

    return (
        <Card
            size="small"
            className={cn(
                'overflow-hidden shadow-2xl',
                EXPORT_REPORT_PROGRESS_POPOVER.widthClassName
            )}
            style={{
                position: 'fixed',
                bottom: 0,
                right: 16,
                zIndex: 50,
            }}
            styles={{
                body: { padding: 0 },
            }}
            title={
                <div className="flex w-full items-center justify-between">
                    <Space size="small">
                        <Typography.Text>
                            <strong>
                                {title} ({jobs.length})
                            </strong>
                        </Typography.Text>
                    </Space>
                    <Space style={{ gap: 6 }}>
                        {isExpanded ? (
                            <ChevronDown
                                className="cursor-pointer text-gray-500 hover:text-gray-800"
                                style={{
                                    width: 20,
                                    height: 20,
                                    display: 'block',
                                }}
                                onClick={() => setIsExpanded(false)}
                            />
                        ) : (
                            <ChevronUp
                                className="cursor-pointer text-gray-500 hover:text-gray-800"
                                style={{
                                    width: 20,
                                    height: 20,
                                    display: 'block',
                                }}
                                onClick={() => setIsExpanded(true)}
                            />
                        )}
                        <X
                            className="cursor-pointer text-gray-500 hover:text-gray-800"
                            style={{ width: 20, height: 20, display: 'block' }}
                            onClick={onClose}
                        />
                    </Space>
                </div>
            }
        >
            <div className={cn(!isExpanded && 'hidden')}>
                <List split className="max-h-[280px] overflow-y-auto px-2">
                    {jobs.map((job) => (
                        <ExportReportProgressItem
                            key={job.id}
                            job={job}
                            onRemoveJob={handleRemoveJob}
                            onStatusChange={handleStatusChange}
                        />
                    ))}
                </List>
            </div>
        </Card>
    );
}
