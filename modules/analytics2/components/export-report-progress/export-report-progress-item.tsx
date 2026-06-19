'use client';

import { EXPORT_REPORT_JOB_STATUS } from '@/modules/analytics2/constants/export-report';
import {
    isExportReportCompleted,
    isExportReportFailed,
} from '@/modules/analytics2/helpers/export-report-helper';
import { useCancelExportAnalyticsReport } from '@/modules/analytics2/hooks/use-cancel-export-analytics-report';
import { useExportAnalyticsReportEvents } from '@/modules/analytics2/hooks/use-export-analytics-report-events';
import { ExportReportJob } from '@/modules/analytics2/types';
import { List, Progress, Typography } from 'antd';
import { AlertCircle, CircleCheck, CircleX, FolderArchive } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect, useMemo, useRef } from 'react';
import { ExportReportJobStatus } from './types';
import { getExportReportProgressPercent } from './utils';

interface ExportReportProgressItemProps {
    job: ExportReportJob;
    onRemoveJob: (jobId: string) => void;
    onStatusChange: (jobId: string, status: ExportReportJobStatus) => void;
}

export default function ExportReportProgressItem({
    job,
    onRemoveJob,
    onStatusChange,
}: ExportReportProgressItemProps) {
    const messages = useTranslations();
    const hasAutoDownloadedRef = useRef(false);
    const { cancelExportAnalyticsReport } = useCancelExportAnalyticsReport();
    const { latestEvent, summary, isListening, isTerminalEvent, error } =
        useExportAnalyticsReportEvents({
            jobId: job.id,
            enabled: true,
        });

    const progressPercent = useMemo(
        () => getExportReportProgressPercent(summary?.progress),
        [summary?.progress]
    );

    const status: ExportReportJobStatus = isExportReportCompleted(
        latestEvent,
        summary
    )
        ? EXPORT_REPORT_JOB_STATUS.COMPLETED
        : isExportReportFailed(latestEvent, summary) || error
          ? EXPORT_REPORT_JOB_STATUS.FAILED
          : EXPORT_REPORT_JOB_STATUS.RUNNING;

    const isCompleted = status === EXPORT_REPORT_JOB_STATUS.COMPLETED;
    const isFailed = status === EXPORT_REPORT_JOB_STATUS.FAILED;
    const isRunning =
        isListening && !isCompleted && !isTerminalEvent && !isFailed;

    const handleRemove = () => {
        if (isRunning) {
            cancelExportAnalyticsReport({ jobId: job.id });
        }
        onRemoveJob(job.id);
    };

    useEffect(() => {
        onStatusChange(job.id, status);
    }, [job.id, onStatusChange, status]);

    useEffect(() => {
        if (
            !isCompleted ||
            !summary?.result?.downloadUrl ||
            hasAutoDownloadedRef.current
        ) {
            return;
        }

        hasAutoDownloadedRef.current = true;

        const downloadLink = document.createElement('a');
        downloadLink.href = summary.result.downloadUrl;
        downloadLink.download = summary.result.fileName || '';
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
    }, [isCompleted, summary?.result?.downloadUrl, summary?.result?.fileName]);

    const fileName =
        summary?.result?.fileName ||
        summary?.file?.name ||
        messages('common.exportReport');
    const progressCurrent = summary?.progress?.current || 0;
    const progressTotal = summary?.progress?.total || 0;

    const renderContent = () => {
        if (isCompleted && summary?.result?.downloadUrl) {
            return (
                <Typography.Link
                    href={summary.result.downloadUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    // ellipsis={{ tooltip: messages('common.exportReportSuccess') }}
                    style={{
                        maxWidth: 190,
                        fontWeight: 500,
                    }}
                >
                    {messages('common.exportReportSuccess')}
                </Typography.Link>
            );
        }

        const text = isFailed
            ? messages('common.exportReportFailed')
            : `${messages('common.processing')} ${progressCurrent}/${progressTotal}`;

        return (
            <Typography.Text
                ellipsis={{ tooltip: text }}
                style={{
                    maxWidth: 190,
                    fontWeight: 500,
                    color: 'rgba(0, 0, 0, 0.45)',
                }}
            >
                {text}
            </Typography.Text>
        );
    };

    return (
        <List.Item className="group !px-4 py-3">
            <div className="flex w-full items-center justify-between gap-3">
                <div className="flex min-w-0 flex-1 items-center gap-3">
                    <FolderArchive
                        className="lucide lucide-folder-archive"
                        style={{
                            width: 20,
                            height: 20,
                            color: 'rgba(0, 0, 0, 0.45)',
                            flexShrink: 0,
                        }}
                    />
                    <div className="min-w-0 flex-1">{renderContent()}</div>
                </div>

                <div className="relative flex h-[25px] w-[25px] shrink-0 items-center justify-center">
                    <div className="flex h-full w-full items-center justify-center group-hover:hidden">
                        {isCompleted ? (
                            <CircleCheck
                                className="lucide lucide-check-circle text-green-500"
                                style={{ width: 20, height: 20 }}
                            />
                        ) : isFailed ? (
                            <AlertCircle
                                className="lucide lucide-alert-circle text-red-500"
                                style={{ width: 20, height: 20 }}
                            />
                        ) : (
                            <Progress
                                type="circle"
                                percent={progressPercent}
                                size={25}
                                showInfo={false}
                                className="ant-progress ant-progress-status-normal ant-progress-circle"
                            />
                        )}
                    </div>
                    <CircleX
                        className="lucide lucide-circle-x hidden cursor-pointer text-red-400 hover:text-red-500 group-hover:block"
                        style={{ width: 25, height: 25 }}
                        onClick={handleRemove}
                    />
                </div>
            </div>
        </List.Item>
    );
}
