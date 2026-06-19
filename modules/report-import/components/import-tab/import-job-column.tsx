import { LoadingOutlined } from '@ant-design/icons';
import { Tag, theme } from 'antd';
import { useTranslations } from 'next-intl';
import React from 'react';
import {
    IMPORT_JOBS_STATUS,
    ImportJobStatusResponse,
} from '../../types/payload';
import { ImportJobOverallProgress } from './import-job-overall-progress';
import { ImportJobDetailedProgress } from './import-job-detailed-progress';
import { ImportJobProcessingStats } from './import-job-processing-stats';
import { ImportJobErrorDisplay } from './import-job-error-display';
import { ImportJobMetadata } from './import-job-metadata';

interface ImportJobColumnProps {
    jobStatus: ImportJobStatusResponse;
    validationResult: any;
}

export const ImportJobColumn: React.FC<ImportJobColumnProps> = ({
    jobStatus,
    validationResult,
}) => {
    const messages = useTranslations();
    const { token } = theme.useToken();

    const filesList = React.useMemo(() => {
        if (
            jobStatus?.progress?.detail?.files &&
            jobStatus.progress.detail.files.length > 0
        ) {
            return jobStatus.progress.detail.files.map((f: any) => ({
                path: f.name,
                status: f.status,
            }));
        }

        if (validationResult?.matched && validationResult.matched.length > 0) {
            return validationResult.matched.map((f: any) => ({
                path: f.path || f.name || 'Unknown',
                status: undefined,
            }));
        }

        return [];
    }, [jobStatus?.progress?.detail?.files, validationResult?.matched]);

    return (
        <div
            style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                gap: 16,
                padding: 16,
                border: `1px solid ${token.colorBorderSecondary}`,
                borderRadius: token.borderRadiusLG,
                backgroundColor: token.colorBgContainer,
                minWidth: 0,
            }}
        >
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}
            >
                <span
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        fontWeight: 600,
                        fontSize: 16,
                    }}
                >
                    {messages('reportConfigs.importResult.processingStatus')}
                </span>
                <div>
                    {jobStatus.status === IMPORT_JOBS_STATUS.PENDING && (
                        <Tag color="warning" icon={<LoadingOutlined spin />}>
                            {messages(
                                'reportConfigs.importResult.statusPending'
                            )}
                        </Tag>
                    )}
                    {jobStatus.status === IMPORT_JOBS_STATUS.QUEUED && (
                        <Tag color="warning" icon={<LoadingOutlined spin />}>
                            {messages(
                                'reportConfigs.importResult.statusQueued'
                            )}
                        </Tag>
                    )}
                    {jobStatus.status === IMPORT_JOBS_STATUS.PROCESSING && (
                        <Tag color="processing" icon={<LoadingOutlined spin />}>
                            {messages(
                                'reportConfigs.importResult.statusProcessing'
                            )}
                        </Tag>
                    )}
                    {jobStatus.status === IMPORT_JOBS_STATUS.COMPLETED && (
                        <Tag color="success">
                            {messages(
                                'reportConfigs.importResult.statusCompleted'
                            )}
                        </Tag>
                    )}
                    {jobStatus.status === IMPORT_JOBS_STATUS.FAILED && (
                        <Tag color="error">
                            {messages(
                                'reportConfigs.importResult.statusFailed'
                            )}
                        </Tag>
                    )}
                </div>
            </div>

            {/* Progress bar */}
            <ImportJobOverallProgress jobStatus={jobStatus} />

            {/* Individual Files Progress */}
            {filesList.length > 0 && (
                <ImportJobDetailedProgress
                    filesList={filesList}
                    jobStatus={jobStatus}
                />
            )}

            {/* Processing Statistics */}
            <ImportJobProcessingStats rows={jobStatus.rows} />

            {/* Error display if job failed */}
            <ImportJobErrorDisplay error={jobStatus.error} />

            {/* Processing metadata */}
            <ImportJobMetadata jobStatus={jobStatus} />
        </div>
    );
};
