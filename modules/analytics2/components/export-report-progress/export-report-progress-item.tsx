'use client';

import {
    EXPORT_REPORT_JOB_STATUS,
    EXPORT_REPORT_PROGRESS_POPOVER,
} from '@/modules/analytics2/constants/export-report';
import {
    isExportReportCompleted,
    isExportReportFailed,
} from '@/modules/analytics2/helpers/export-report-helper';
import { useExportAnalyticsReportEvents } from '@/modules/analytics2/hooks/use-export-analytics-report-events';
import { ExportReportJob } from '@/modules/analytics2/types';
import {
    CheckCircleFilled,
    CloseOutlined,
    DownloadOutlined,
    ExclamationCircleFilled,
    FileZipOutlined,
    LoadingOutlined,
} from '@ant-design/icons';
import { Button, Progress, Tooltip } from 'antd';
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
    const completedCount =
        summary?.result?.totalProcessedRows ||
        summary?.rows?.processed ||
        EXPORT_REPORT_PROGRESS_POPOVER.defaultCompletedCount;
    const progressCurrent = summary?.progress?.current || 0;
    const progressTotal = summary?.progress?.total || 0;
    const progressText = `${progressCurrent}/${progressTotal}`;

    return (
        <div className="flex items-start gap-3 border-b border-gray-100 py-3 last:border-b-0">
            <FileZipOutlined className="mt-1 text-lg text-gray-500" />
            <div className="min-w-0 flex-1">
                <div
                    className="truncate text-sm font-medium text-gray-900"
                    title={fileName}
                >
                    {fileName}
                </div>
                <div className="text-sm text-gray-500">
                    {isCompleted
                        ? messages('common.exportReportCompressed', {
                              count: completedCount,
                          })
                        : progressText}
                </div>

                {isCompleted && summary?.result?.downloadUrl ? (
                    <Button
                        className="!px-0 hover:!text-blue-500"
                        type="link"
                        icon={<DownloadOutlined />}
                        href={summary.result.downloadUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        {messages('common.download')}
                    </Button>
                ) : null}
            </div>

            <div className="flex shrink-0 items-center gap-1">
                {isCompleted ? (
                    <CheckCircleFilled className="text-xl !text-green-500" />
                ) : isFailed ? (
                    <ExclamationCircleFilled className="text-xl !text-red-500" />
                ) : isRunning ? (
                    <Progress
                        type="circle"
                        percent={progressPercent}
                        size={20}
                        showInfo={false}
                    />
                ) : (
                    <LoadingOutlined className="text-xl text-blue-500" />
                )}

                <Tooltip title={messages('common.close')}>
                    <Button
                        type="text"
                        shape="circle"
                        size="small"
                        icon={<CloseOutlined />}
                        onClick={() => onRemoveJob(job.id)}
                    />
                </Tooltip>
            </div>
        </div>
    );
}
