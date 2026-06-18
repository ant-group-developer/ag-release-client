'use client';

import {
    EXPORT_REPORT_JOB_STATUS,
    EXPORT_REPORT_PROGRESS_POPOVER,
} from '@/modules/analytics2/constants/export-report';
import { ExportReportJob } from '@/modules/analytics2/types';
import { CloseOutlined, DownOutlined, UpOutlined } from '@ant-design/icons';
import { Button, theme, Tooltip } from 'antd';
import clsx from 'clsx';
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
        <div
            className={clsx(
                'fixed bottom-4 right-4 overflow-hidden rounded-lg border bg-white shadow-2xl',
                EXPORT_REPORT_PROGRESS_POPOVER.widthClassName,
                EXPORT_REPORT_PROGRESS_POPOVER.zIndexClassName
            )}
            style={{
                borderColor: token.colorBorderSecondary,
            }}
        >
            <div className="flex items-center justify-between gap-3 border-b border-gray-100 px-4 py-3">
                <div className="min-w-0 flex-1 text-base font-semibold text-gray-900">
                    {title}
                </div>
                <div className="flex shrink-0 items-center gap-1">
                    <Tooltip
                        title={
                            isExpanded
                                ? messages('common.collapse')
                                : messages('common.expand')
                        }
                    >
                        <Button
                            type="text"
                            shape="circle"
                            icon={
                                isExpanded ? <DownOutlined /> : <UpOutlined />
                            }
                            onClick={() => setIsExpanded((prev) => !prev)}
                        />
                    </Tooltip>
                    <Tooltip title={messages('common.close')}>
                        <Button
                            type="text"
                            shape="circle"
                            icon={<CloseOutlined />}
                            onClick={onClose}
                        />
                    </Tooltip>
                </div>
            </div>

            <div
                className={clsx(
                    'max-h-[280px] overflow-y-auto px-4',
                    !isExpanded && 'hidden'
                )}
            >
                {jobs.map((job) => (
                    <ExportReportProgressItem
                        key={job.id}
                        job={job}
                        onRemoveJob={handleRemoveJob}
                        onStatusChange={handleStatusChange}
                    />
                ))}
            </div>
        </div>
    );
}
