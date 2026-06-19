import { formattedNumber } from '@/helpers/common';
import { Progress, theme } from 'antd';
import { useTranslations } from 'next-intl';
import React from 'react';
import {
    IMPORT_JOBS_STATUS,
    ImportJobStatusResponse,
} from '../../types/payload';

interface ImportJobOverallProgressProps {
    jobStatus: ImportJobStatusResponse;
}

export const ImportJobOverallProgress: React.FC<ImportJobOverallProgressProps> = ({
    jobStatus,
}) => {
    const messages = useTranslations();
    const { token } = theme.useToken();

    return (
        <div className="mt-2">
            <Progress
                percent={
                    jobStatus.progress.total > 0
                        ? Math.round(
                              (jobStatus.progress.current /
                                  jobStatus.progress.total) *
                                  100
                          )
                        : 0
                }
                status={
                    jobStatus.status === IMPORT_JOBS_STATUS.COMPLETED
                        ? 'success'
                        : jobStatus.status === IMPORT_JOBS_STATUS.FAILED
                          ? 'exception'
                          : 'active'
                }
                format={() => {
                    return `${formattedNumber(jobStatus.progress.current)}/${formattedNumber(jobStatus.progress.total)}`;
                }}
            />
            {jobStatus.progress.label && (
                <div
                    className="text-xs mt-1"
                    style={{
                        color: token.colorTextDescription,
                    }}
                >
                    {messages('reportConfigs.importResult.runningFile', {
                        file: jobStatus.progress.label,
                    })}
                </div>
            )}
        </div>
    );
};
