'use client';

import { cn } from '@/helpers/common';
import {
    CANCEL_CONFIRM_MODAL_WIDTH,
    EXPORT_REPORT_JOB_STATUS,
    EXPORT_REPORT_PROGRESS_POPOVER,
    WARNING_ICON_COLOR,
} from '@/modules/analytics2/constants/export-report';
import { ExportReportJob } from '@/modules/analytics2/types';
import { Button, Card, List, Modal, Space, Typography } from 'antd';
import { AlertCircle, ChevronDown, ChevronUp, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useCallback, useEffect, useState } from 'react';
import ExportReportProgressItem from './export-report-progress-item';
import { ExportReportJobStatus } from './types';
import { useCancelExportAnalyticsReportList } from '@/modules/analytics2/hooks/use-cancel-export-analytics-report-list';

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
    // const { token } = theme.useToken();
    const [isExpanded, setIsExpanded] = useState(true);
    const [statusByJobId, setStatusByJobId] = useState<
        Record<string, ExportReportJobStatus>
    >({});
    const { cancelExportAnalyticsReportList } = useCancelExportAnalyticsReportList();

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

    useEffect(() => {
        if (jobs.length > 0 && isAllCompleted) {
            const timer = setTimeout(() => {
                onClose();
            }, 15000);

            return () => clearTimeout(timer);
        }
    }, [isAllCompleted, jobs.length, onClose]);

    useEffect(() => {
        const handleBeforeUnload = () => {
            const runningJobIds = jobs
                .filter((job) => {
                    const status = statusByJobId[job.id] || EXPORT_REPORT_JOB_STATUS.RUNNING;
                    return status === EXPORT_REPORT_JOB_STATUS.RUNNING;
                })
                .map((job) => job.id);

            if (runningJobIds.length > 0) {
                fetch('/api/v1/analytics/reports/export/cancel-list', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ jobIds: runningJobIds }),
                    keepalive: true,
                });
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [jobs, statusByJobId]);

    const [isConfirmOpen, setIsConfirmOpen] = useState(false);

    const handleCloseClick = () => {
        const runningJobIds = jobs
            .filter((job) => {
                const status = statusByJobId[job.id] || EXPORT_REPORT_JOB_STATUS.RUNNING;
                return status === EXPORT_REPORT_JOB_STATUS.RUNNING;
            })
            .map((job) => job.id);

        if (runningJobIds.length > 0) {
            setIsConfirmOpen(true);
        } else {
            onClose();
        }
    };

    const handleCancelDownload = () => {
        const runningJobIds = jobs
            .filter((job) => {
                const status = statusByJobId[job.id] || EXPORT_REPORT_JOB_STATUS.RUNNING;
                return status === EXPORT_REPORT_JOB_STATUS.RUNNING;
            })
            .map((job) => job.id);

        if (runningJobIds.length > 0) {
            cancelExportAnalyticsReportList({ jobIds: runningJobIds });
        }
        setIsConfirmOpen(false);
        onClose();
    };

    const handleContinueDownload = () => {
        setIsConfirmOpen(false);
    };

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
                zIndex: 1050,
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
                            onClick={handleCloseClick}
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
            <Modal
                open={isConfirmOpen}
                closable={false}
                footer={null}
                centered
                width={CANCEL_CONFIRM_MODAL_WIDTH}
                onCancel={handleContinueDownload}
            >
                <div className="flex gap-4">
                    <AlertCircle
                        style={{
                            width: 24,
                            height: 24,
                            color: WARNING_ICON_COLOR,
                            flexShrink: 0,
                        }}
                    />
                    <div className="flex flex-col gap-2">
                        <Typography.Text className="text-lg font-bold text-gray-900 leading-6">
                            {messages('common.cancelDownloadConfirmTitle')}
                        </Typography.Text>
                        <Typography.Text className="text-sm text-gray-500 leading-5">
                            {messages('common.cancelDownloadConfirmContent')}
                        </Typography.Text>
                    </div>
                </div>
                <div className="mt-6 flex justify-end gap-3">
                    <Button onClick={handleContinueDownload}>
                        {messages('common.continueDownload')}
                    </Button>
                    <Button type="primary" danger onClick={handleCancelDownload}>
                        {messages('common.cancelDownload')}
                    </Button>
                </div>
            </Modal>
        </Card>
    );
}
