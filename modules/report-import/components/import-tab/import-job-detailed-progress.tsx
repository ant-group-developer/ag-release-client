import { Progress, theme } from 'antd';
import { useTranslations } from 'next-intl';
import React from 'react';
import {
    IMPORT_JOBS_STATUS,
    ImportJobStatusResponse,
} from '../../types/payload';

interface ImportJobDetailedProgressProps {
    filesList: any[];
    jobStatus: ImportJobStatusResponse;
}

export const ImportJobDetailedProgress: React.FC<ImportJobDetailedProgressProps> = ({
    filesList,
    jobStatus,
}) => {
    const messages = useTranslations();
    const { token } = theme.useToken();

    return (
        <div className="mt-2">
            <div
                className="text-[13px] font-semibold mb-2"
                style={{
                    color: token.colorText,
                }}
            >
                {messages('reportConfigs.importResult.detailedProgress')}
            </div>
            <div
                className="max-h-[180px] overflow-y-auto p-3 flex flex-col gap-3"
                style={{
                    border: `1px solid ${token.colorBorderSecondary}`,
                    borderRadius: token.borderRadiusLG,
                    backgroundColor: token.colorBgLayout,
                }}
            >
                {filesList.map((file: any, idx: number) => {
                    const totalFiles =
                        jobStatus.progress.total || filesList.length;
                    const currentIdx = jobStatus.progress.current;

                    let percent = 0;
                    let status:
                        | 'normal'
                        | 'active'
                        | 'success'
                        | 'exception' = 'normal';

                    if (file.status) {
                        if (file.status === 'done') {
                            percent = 100;
                            status = 'success';
                        } else if (file.status === 'failed') {
                            percent = 100;
                            status = 'exception';
                        } else if (file.status === 'processing') {
                            status = 'active';
                            const overallRowPercent =
                                jobStatus.rows.total > 0
                                    ? Math.round(
                                          (jobStatus.rows.processed /
                                              jobStatus.rows.total) *
                                              100
                                      )
                                    : 0;
                            percent =
                                totalFiles > 0
                                    ? Math.min(
                                          100,
                                          Math.max(
                                              0,
                                              overallRowPercent * totalFiles -
                                                  idx * 100
                                          )
                                      )
                                    : 0;
                        } else {
                            percent = 0;
                            status = 'normal';
                        }
                    } else {
                        if (
                            jobStatus.status === IMPORT_JOBS_STATUS.COMPLETED
                        ) {
                            percent = 100;
                            status = 'success';
                        } else if (idx < currentIdx) {
                            percent = 100;
                            status = 'success';
                        } else if (idx === currentIdx) {
                            if (
                                jobStatus.status === IMPORT_JOBS_STATUS.FAILED
                            ) {
                                percent = 100;
                                status = 'exception';
                            } else {
                                status = 'active';
                                const overallRowPercent =
                                    jobStatus.rows.total > 0
                                        ? Math.round(
                                              (jobStatus.rows.processed /
                                                  jobStatus.rows.total) *
                                                  100
                                          )
                                        : 0;
                                percent =
                                    totalFiles > 0
                                        ? Math.min(
                                              100,
                                              Math.max(
                                                  0,
                                                  overallRowPercent *
                                                      totalFiles -
                                                      currentIdx * 100
                                              )
                                          )
                                        : 0;
                            }
                        } else {
                            percent = 0;
                            status = 'normal';
                        }
                    }

                    return (
                        <div key={idx} className="flex flex-col gap-1">
                            <div className="flex justify-between items-center">
                                <span
                                    className="text-xs font-medium mr-2 break-all"
                                    style={{
                                        color: token.colorText,
                                    }}
                                >
                                    {file.path}
                                </span>
                                <span
                                    className="text-[11px] shrink-0"
                                    style={{
                                        color: token.colorTextDescription,
                                    }}
                                >
                                    {status === 'success' && (
                                        <span
                                            style={{
                                                color: token.colorSuccess,
                                            }}
                                        >
                                            {messages(
                                                'reportConfigs.importResult.statusCompleted'
                                            )}
                                        </span>
                                    )}
                                    {status === 'active' && (
                                        <span
                                            style={{
                                                color: token.colorPrimary,
                                            }}
                                        >
                                            {messages(
                                                'reportConfigs.importResult.statusProcessing'
                                            )}
                                        </span>
                                    )}
                                    {status === 'exception' && (
                                        <span
                                            style={{
                                                color: token.colorError,
                                            }}
                                        >
                                            {messages(
                                                'reportConfigs.importResult.statusFailed'
                                            )}
                                        </span>
                                    )}
                                    {status === 'normal' && (
                                        <span>
                                            {messages(
                                                'reportConfigs.importResult.statusPending'
                                            )}
                                        </span>
                                    )}
                                </span>
                            </div>
                            <Progress
                                percent={percent}
                                status={status}
                                size="small"
                                strokeColor={
                                    status === 'success'
                                        ? token.colorSuccess
                                        : undefined
                                }
                            />
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
