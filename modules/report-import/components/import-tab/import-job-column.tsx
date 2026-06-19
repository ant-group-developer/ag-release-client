import {
    convertSecondsToHHMMSS,
    formattedDate,
    formattedNumber,
} from '@/helpers/common';
import { LoadingOutlined } from '@ant-design/icons';
import { Progress, Tag, theme } from 'antd';
import { useTranslations } from 'next-intl';
import React from 'react';
import {
    IMPORT_JOBS_STATUS,
    ImportJobStatusResponse,
} from '../../types/payload';

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
            <div style={{ marginTop: 8 }}>
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
                        return `${formattedNumber(jobStatus.progress.current)}/${formattedNumber(jobStatus.progress.total)} ${messages('reportConfigs.importResult.filesUnit')}`;
                    }}
                />
                {jobStatus.progress.label && (
                    <div
                        style={{
                            fontSize: 12,
                            color: token.colorTextDescription,
                            marginTop: 4,
                        }}
                    >
                        {messages('reportConfigs.importResult.runningFile', {
                            file: jobStatus.progress.label,
                        })}
                    </div>
                )}
            </div>

            {/* Individual Files Progress */}
            {validationResult?.matched?.length > 0 && (
                <div style={{ marginTop: 8 }}>
                    <div
                        style={{
                            fontSize: 13,
                            fontWeight: 600,
                            color: token.colorText,
                            marginBottom: 8,
                        }}
                    >
                        {messages(
                            'reportConfigs.importResult.detailedProgress'
                        )}
                    </div>
                    <div
                        style={{
                            maxHeight: 180,
                            overflowY: 'auto',
                            border: `1px solid ${token.colorBorderSecondary}`,
                            borderRadius: token.borderRadiusLG,
                            padding: '12px',
                            backgroundColor: token.colorBgLayout,
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 12,
                        }}
                    >
                        {validationResult.matched.map(
                            (file: any, idx: number) => {
                                const totalFiles =
                                    jobStatus.progress.total ||
                                    validationResult.matched.length;
                                const currentIdx = jobStatus.progress.current;

                                let percent = 0;
                                let status:
                                    | 'normal'
                                    | 'active'
                                    | 'success'
                                    | 'exception' = 'normal';

                                if (
                                    jobStatus.status ===
                                    IMPORT_JOBS_STATUS.COMPLETED
                                ) {
                                    percent = 100;
                                    status = 'success';
                                } else if (idx < currentIdx) {
                                    percent = 100;
                                    status = 'success';
                                } else if (idx === currentIdx) {
                                    if (
                                        jobStatus.status ===
                                        IMPORT_JOBS_STATUS.FAILED
                                    ) {
                                        percent = 100;
                                        status = 'exception';
                                    } else {
                                        status = 'active';
                                        const overallRowPercent =
                                            jobStatus.rows.total > 0
                                                ? Math.round(
                                                      (jobStatus.rows
                                                          .processed /
                                                          jobStatus.rows
                                                              .total) *
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

                                return (
                                    <div
                                        key={idx}
                                        style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: 4,
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
                                                    fontSize: 12,
                                                    fontWeight: 500,
                                                    color: token.colorText,
                                                    wordBreak: 'break-all',
                                                    marginRight: 8,
                                                }}
                                            >
                                                {file.path}
                                            </span>
                                            <span
                                                style={{
                                                    fontSize: 11,
                                                    color: token.colorTextDescription,
                                                    flexShrink: 0,
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
                            }
                        )}
                    </div>
                </div>
            )}

            {/* Processing Statistics */}
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: 12,
                    marginTop: 8,
                    backgroundColor: token.colorBgLayout,
                    padding: 12,
                    borderRadius: token.borderRadius,
                }}
            >
                <div>
                    <div
                        style={{
                            fontSize: 12,
                            color: token.colorTextDescription,
                        }}
                    >
                        {messages('reportConfigs.importResult.totalRecords')}
                    </div>
                    <div
                        style={{
                            fontSize: 16,
                            fontWeight: 600,
                            color: token.colorText,
                        }}
                    >
                        {jobStatus.rows.total.toLocaleString()}
                    </div>
                </div>
                <div>
                    <div
                        style={{
                            fontSize: 12,
                            color: token.colorTextDescription,
                        }}
                    >
                        {messages(
                            'reportConfigs.importResult.processedSuccess'
                        )}
                    </div>
                    <div
                        style={{
                            fontSize: 16,
                            fontWeight: 600,
                            color: token.colorSuccess,
                        }}
                    >
                        {jobStatus.rows.processed.toLocaleString()}
                    </div>
                </div>
                <div>
                    <div
                        style={{
                            fontSize: 12,
                            color: token.colorTextDescription,
                        }}
                    >
                        {messages('reportConfigs.importResult.skipped')}
                    </div>
                    <div
                        style={{
                            fontSize: 16,
                            fontWeight: 600,
                            color: token.colorWarning,
                        }}
                    >
                        {jobStatus.rows.skipped.toLocaleString()}
                    </div>
                </div>
                <div>
                    <div
                        style={{
                            fontSize: 12,
                            color: token.colorTextDescription,
                        }}
                    >
                        {messages('reportConfigs.importResult.errors')}
                    </div>
                    <div
                        style={{
                            fontSize: 16,
                            fontWeight: 600,
                            color: token.colorError,
                        }}
                    >
                        {jobStatus.rows.errors.toLocaleString()}
                    </div>
                </div>
            </div>

            {/* Error display if job failed */}
            {jobStatus.error && (
                <div
                    style={{
                        padding: 12,
                        borderRadius: token.borderRadius,
                        backgroundColor: token.colorErrorBg,
                        border: `1px solid ${token.colorErrorBorder}`,
                        color: token.colorErrorText,
                        fontSize: 13,
                    }}
                >
                    <strong>
                        {messages('reportConfigs.importResult.errorDetails')}:
                    </strong>{' '}
                    {jobStatus.error}
                </div>
            )}

            {/* Processing metadata */}
            <div
                style={{
                    fontSize: 12,
                    color: token.colorTextDescription,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 12,
                    marginTop: 'auto',
                    paddingTop: 12,
                    borderTop: `1px solid ${token.colorBorderSecondary}`,
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 4,
                        width: '100%',
                    }}
                >
                    <span style={{ fontWeight: 600 }}>
                        {messages('reportConfigs.importResult.sourceFile')}:
                    </span>
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 2,
                            maxHeight: 200,
                            overflowY: 'auto',
                        }}
                    >
                        {(jobStatus.file
                            ? jobStatus.file
                                  .split(',')
                                  .map((f: string) => f.trim())
                                  .filter(Boolean)
                            : []
                        ).map((file: string, idx: number) => (
                            <span key={idx} style={{ wordBreak: 'break-all' }}>
                                {file}
                            </span>
                        ))}
                    </div>
                </div>

                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        gap: 16,
                        flexWrap: 'wrap',
                    }}
                >
                    {jobStatus.startedAt ? (
                        <div>
                            <span style={{ fontWeight: 600, marginRight: 4 }}>
                                {messages('common.startedAt')}:
                            </span>
                            <span>{formattedDate(jobStatus.startedAt)}</span>
                        </div>
                    ) : (
                        <div />
                    )}
                    {jobStatus.durationMs > 0 && (
                        <div>
                            <span style={{ fontWeight: 600, marginRight: 4 }}>
                                {messages(
                                    'reportConfigs.importResult.duration'
                                )}
                                :
                            </span>
                            <span>
                                {convertSecondsToHHMMSS(
                                    jobStatus.durationMs / 1000
                                )}
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
