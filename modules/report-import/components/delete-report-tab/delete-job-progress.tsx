'use client';

import { Alert, Descriptions, Progress, Typography } from 'antd';
import { useTranslations } from 'next-intl';
import React, { useMemo } from 'react';
import { formattedNumber } from '@/helpers/common';
import { IMPORT_JOBS_STATUS, EtlJobData } from '../../types/payload';

interface DeleteJobProgressProps {
    jobId: string | null;
    summary: Partial<EtlJobData> | null;
    error: Error | null;
}

const getProgressPercent = (progress?: { current: number; total: number }) => {
    if (!progress?.total) return 0;

    return Math.min(
        100,
        Math.max(0, Math.round((progress.current / progress.total) * 100))
    );
};

export default function DeleteJobProgress({
    jobId,
    summary,
    error,
}: DeleteJobProgressProps) {
    const messages = useTranslations();

    const progressPercent = useMemo(
        () => getProgressPercent(summary?.progress),
        [summary?.progress]
    );

    const isCompleted = summary?.status === IMPORT_JOBS_STATUS.COMPLETED;
    const isFailed = summary?.status === IMPORT_JOBS_STATUS.FAILED || !!error;
    const isJobStarted = !!jobId;

    if (!isJobStarted) return null;

    return (
        <div className="mt-4 rounded-md border border-gray-200 p-4">
            <div className="mb-3 flex items-center justify-between gap-3">
                <Typography.Text strong>
                    {messages('common.progress')}
                </Typography.Text>
                <Typography.Text type={isFailed ? 'danger' : undefined}>
                    {summary?.status || messages('common.processing')}
                </Typography.Text>
            </div>

            <Progress
                percent={progressPercent}
                status={
                    isFailed
                        ? 'exception'
                        : isCompleted
                          ? 'success'
                          : 'active'
                }
            />

            {summary?.progress?.label && (
                <Typography.Paragraph className="!mb-3">
                    {summary.progress.label}
                </Typography.Paragraph>
            )}

            <Descriptions column={2} size="small" bordered>
                <Descriptions.Item
                    label={messages('reportConfigs.importResult.totalRows')}
                >
                    {formattedNumber(summary?.rows?.total || 0)}
                </Descriptions.Item>
                <Descriptions.Item
                    label={messages('reportConfigs.importResult.processedRows')}
                >
                    {formattedNumber(summary?.rows?.processed || 0)}
                </Descriptions.Item>
                <Descriptions.Item
                    label={messages('release.deleteReport.matchedReleases')}
                >
                    {formattedNumber(summary?.params?.matchedReleases || 0)}
                </Descriptions.Item>
                <Descriptions.Item
                    label={messages('release.deleteReport.matchedTracks')}
                >
                    {formattedNumber(summary?.params?.matchedTracks || 0)}
                </Descriptions.Item>
            </Descriptions>

            {(summary?.error || error) && (
                <Alert
                    className="!mt-3"
                    type="error"
                    showIcon
                    message={
                        summary?.error ||
                        error?.message ||
                        messages('common.somethingWentWrong')
                    }
                />
            )}
        </div>
    );
}
