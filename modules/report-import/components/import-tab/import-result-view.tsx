import { LoadingOutlined } from '@ant-design/icons';
import { Progress, Spin, Tag, theme } from 'antd';
import React from 'react';
import { useTranslations } from 'next-intl';
import {
    FileUploadStatus,
    ImportJobStatus,
    ImportJobStatusResponse,
    PreValidateImportResponse,
} from '../../types/payload';

interface ImportResultViewProps {
    validationResult: PreValidateImportResponse;
    startedJobId: string | null;
    jobStatus: ImportJobStatusResponse | undefined;
    isUploading: boolean;
    uploadStatus: FileUploadStatus;
    uploadError: string | null;
    uploadResults: Record<
        string,
        { status: FileUploadStatus; progress?: number; error?: string }
    >;
    readOnly?: boolean;
}

export const ImportResultView: React.FC<ImportResultViewProps> = ({
    validationResult,
    startedJobId,
    jobStatus,
    isUploading,
    uploadStatus,
    uploadError,
    uploadResults,
    readOnly = false,
}) => {
    const messages = useTranslations();
    const { token } = theme.useToken();

    const showLeftColumn = !readOnly;
    const showRightColumn = !!(startedJobId && jobStatus);
    const isSideBySide = showLeftColumn && showRightColumn;
    const isJobProcessing =
        jobStatus?.status === ImportJobStatus.PENDING ||
        jobStatus?.status === ImportJobStatus.PROCESSING;

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: isSideBySide ? 'row' : 'column',
                gap: 24,
                marginTop: 24,
                alignItems: 'stretch',
            }}
        >
            {/* Left Column: File validation lists & banners */}
            {showLeftColumn && (
                <div
                style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 16,
                    minWidth: 0,
                }}
            >
                {/* Matched Files / Upload Status Banner */}
                {validationResult.matched?.length > 0 &&
                    (isUploading || uploadStatus === FileUploadStatus.FAILED) && (
                        <div
                            style={{
                                padding: 16,
                                borderRadius: token.borderRadiusLG,
                                backgroundColor: isUploading
                                    ? token.colorInfoBg
                                    : token.colorErrorBg,
                                border: `1px solid ${
                                    isUploading
                                        ? token.colorInfoBorder
                                        : token.colorErrorBorder
                                }`,
                            }}
                        >
                            <div
                                style={{
                                    fontWeight: 600,
                                    color: isUploading
                                        ? token.colorInfoText
                                        : token.colorErrorText,
                                }}
                            >
                                {isUploading
                                    ? messages('reportConfigs.importResult.uploadingMatched', { count: validationResult.matched.length })
                                    : messages('reportConfigs.importResult.uploadFailedMatched', { count: validationResult.matched.length })}
                            </div>
                            {uploadStatus === 'failed' && uploadError && (
                                <div
                                    style={{
                                        marginTop: 8,
                                        fontSize: 13,
                                        color: token.colorErrorText,
                                    }}
                                >
                                    {messages('reportConfigs.importResult.errorDetails')}: {uploadError}
                                </div>
                            )}
                        </div>
                    )}

                {/* No matched files (validation failed completely) */}
                {(!validationResult.matched ||
                    validationResult.matched.length === 0) && (
                    <div
                        style={{
                            padding: 16,
                            borderRadius: token.borderRadiusLG,
                            backgroundColor: token.colorWarningBg,
                            border: `1px solid ${token.colorWarningBorder}`,
                        }}
                    >
                        <div
                            style={{
                                fontWeight: 600,
                                color: token.colorWarningText,
                            }}
                        >
                            {messages('reportConfigs.importResult.noValidFiles')}
                        </div>
                    </div>
                )}

                {/* Matched Files List with Upload Status */}
                {validationResult.matched?.length > 0 && (
                    <div>
                        <h4
                            style={{
                                color: token.colorText,
                                marginBottom: 8,
                                fontWeight: 600,
                            }}
                        >
                            {messages('reportConfigs.importResult.validFiles', { count: validationResult.matched.length })}
                        </h4>
                        <div
                            style={{
                                maxHeight: isSideBySide ? 300 : 200,
                                overflowY: 'auto',
                                border: `1px solid ${token.colorBorderSecondary}`,
                                borderRadius: token.borderRadiusLG,
                                padding: '8px 16px',
                                backgroundColor: token.colorBgLayout,
                            }}
                        >
                            {validationResult.matched.map(
                                (item: any, idx: number) => {
                                    const result = uploadResults[item.path];
                                    return (
                                        <div
                                            key={idx}
                                            style={{
                                                padding: '8px 0',
                                                borderBottom:
                                                    idx <
                                                    validationResult.matched
                                                        .length -
                                                        1
                                                        ? `1px solid ${token.colorBorderSecondary}`
                                                        : 'none',
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                gap: 12,
                                            }}
                                        >
                                            <span
                                                style={{
                                                    fontWeight: 500,
                                                    fontSize: 13,
                                                    color: token.colorText,
                                                    wordBreak: 'break-all',
                                                }}
                                            >
                                                {item.path}
                                            </span>
                                            <span
                                                style={{
                                                    flexShrink: 0,
                                                    fontSize: 12,
                                                }}
                                            >
                                                {result?.status ===
                                                    FileUploadStatus.UPLOADING && (
                                                    <span
                                                        style={{
                                                            color: token.colorPrimary,
                                                        }}
                                                    >
                                                        {messages('reportConfigs.importResult.uploading')}
                                                        {result.progress !== undefined && ` (${result.progress}%)`}
                                                    </span>
                                                )}
                                                {result?.status ===
                                                    FileUploadStatus.SUCCESS && (
                                                    <span
                                                        style={{
                                                            color: token.colorSuccess,
                                                        }}
                                                    >
                                                        {messages('reportConfigs.importResult.uploadSuccess')}
                                                    </span>
                                                )}
                                                {result?.status ===
                                                    FileUploadStatus.FAILED && (
                                                    <span
                                                        style={{
                                                            color: token.colorError,
                                                        }}
                                                        title={result.error}
                                                    >
                                                        {messages('reportConfigs.importResult.uploadFailed')}
                                                    </span>
                                                )}
                                                {!result && (
                                                    <span
                                                        style={{
                                                            color: token.colorTextDescription,
                                                        }}
                                                    >
                                                        {messages('reportConfigs.importResult.awaitingUpload')}
                                                    </span>
                                                )}
                                            </span>
                                        </div>
                                    );
                                }
                            )}
                        </div>
                    </div>
                )}

                {/* Invalid Files List */}
                {validationResult.invalid?.length > 0 && (
                    <div>
                        <h4
                            style={{
                                color: token.colorError,
                                marginBottom: 8,
                                fontWeight: 600,
                            }}
                        >
                            {messages('reportConfigs.importResult.invalidFiles', { count: validationResult.invalid.length })}
                        </h4>
                        <div
                            style={{
                                maxHeight: isSideBySide ? 300 : 240,
                                overflowY: 'auto',
                                border: `1px solid ${token.colorBorderSecondary}`,
                                borderRadius: token.borderRadiusLG,
                                padding: '8px 16px',
                                backgroundColor: token.colorBgLayout,
                            }}
                        >
                            {validationResult.invalid.map(
                                (item: any, idx: number) => (
                                    <div
                                        key={idx}
                                        style={{
                                            padding: '8px 0',
                                            borderBottom:
                                                idx <
                                                validationResult.invalid
                                                    .length -
                                                    1
                                                    ? `1px solid ${token.colorBorderSecondary}`
                                                    : 'none',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: 2,
                                        }}
                                    >
                                        <span
                                            style={{
                                                fontWeight: 500,
                                                fontSize: 13,
                                                color: token.colorText,
                                            }}
                                        >
                                            {item.path}
                                        </span>
                                        <span
                                            style={{
                                                fontSize: 12,
                                                color: token.colorError,
                                            }}
                                        >
                                            {item.reason}
                                        </span>
                                    </div>
                                )
                            )}
                        </div>
                    </div>
                )}
                </div>
            )}

            {/* Right Column: Job Processing Status Panel */}
            {showRightColumn && (
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
                            {jobStatus.status === ImportJobStatus.PENDING && (
                                <Tag
                                    color="warning"
                                    icon={<LoadingOutlined spin />}
                                >
                                    {messages('reportConfigs.importResult.statusPending')}
                                </Tag>
                            )}
                            {jobStatus.status ===
                                ImportJobStatus.PROCESSING && (
                                <Tag
                                    color="processing"
                                    icon={<LoadingOutlined spin />}
                                >
                                    {messages('reportConfigs.importResult.statusProcessing')}
                                </Tag>
                            )}
                            {jobStatus.status === ImportJobStatus.COMPLETED && (
                                <Tag color="success">
                                    {messages('reportConfigs.importResult.statusCompleted')}
                                </Tag>
                            )}
                            {jobStatus.status === ImportJobStatus.FAILED && (
                                <Tag color="error">
                                    {messages('reportConfigs.importResult.statusFailed')}
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
                                jobStatus.status === ImportJobStatus.COMPLETED
                                    ? 'success'
                                    : jobStatus.status ===
                                        ImportJobStatus.FAILED
                                      ? 'exception'
                                      : 'active'
                            }
                            format={() => {
                                return `${jobStatus.progress.current}/${jobStatus.progress.total} ${messages('reportConfigs.importResult.filesUnit')}`;
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
                                {messages('reportConfigs.importResult.runningFile', { file: jobStatus.progress.label })}
                            </div>
                        )}
                    </div>

                    {/* Individual Files Progress */}
                    {validationResult.matched?.length > 0 && (
                        <div style={{ marginTop: 8 }}>
                            <div
                                style={{
                                    fontSize: 13,
                                    fontWeight: 600,
                                    color: token.colorText,
                                    marginBottom: 8,
                                }}
                            >
                                {messages('reportConfigs.importResult.detailedProgress')}
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
                                {validationResult.matched.map((file: any, idx: number) => {
                                    const totalFiles = jobStatus.progress.total || validationResult.matched.length;
                                    const currentIdx = jobStatus.progress.current;
                                    
                                    let percent = 0;
                                    let status: 'normal' | 'active' | 'success' | 'exception' = 'normal';
                                    
                                    if (jobStatus.status === ImportJobStatus.COMPLETED) {
                                        percent = 100;
                                        status = 'success';
                                    } else if (idx < currentIdx) {
                                        percent = 100;
                                        status = 'success';
                                    } else if (idx === currentIdx) {
                                        if (jobStatus.status === ImportJobStatus.FAILED) {
                                            percent = 100;
                                            status = 'exception';
                                        } else {
                                            status = 'active';
                                            const overallRowPercent = jobStatus.rows.total > 0
                                                ? Math.round((jobStatus.rows.processed / jobStatus.rows.total) * 100)
                                                : 0;
                                            percent = totalFiles > 0
                                                ? Math.min(100, Math.max(0, (overallRowPercent * totalFiles) - (currentIdx * 100)))
                                                : 0;
                                        }
                                    } else {
                                        percent = 0;
                                        status = 'normal';
                                    }

                                    return (
                                        <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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
                                                <span style={{ fontSize: 11, color: token.colorTextDescription, flexShrink: 0 }}>
                                                    {status === 'success' && (
                                                        <span style={{ color: token.colorSuccess }}>
                                                            {messages('reportConfigs.importResult.statusCompleted')}
                                                        </span>
                                                    )}
                                                    {status === 'active' && (
                                                        <span style={{ color: token.colorPrimary }}>
                                                            {messages('reportConfigs.importResult.statusProcessing')}
                                                        </span>
                                                    )}
                                                    {status === 'exception' && (
                                                        <span style={{ color: token.colorError }}>
                                                            {messages('reportConfigs.importResult.statusFailed')}
                                                        </span>
                                                    )}
                                                    {status === 'normal' && (
                                                        <span>
                                                            {messages('reportConfigs.importResult.statusPending')}
                                                        </span>
                                                    )}
                                                </span>
                                            </div>
                                            <Progress
                                                percent={percent}
                                                status={status}
                                                size="small"
                                                strokeColor={status === 'success' ? token.colorSuccess : undefined}
                                            />
                                        </div>
                                    );
                                })}
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
                                {messages('reportConfigs.importResult.processedSuccess')}
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
                            <strong>{messages('reportConfigs.importResult.errorDetails')}:</strong> {jobStatus.error}
                        </div>
                    )}

                    {/* Processing metadata */}
                    <div
                        style={{
                            fontSize: 12,
                            color: token.colorTextDescription,
                            display: 'flex',
                            justifyContent: 'space-between',
                            marginTop: 'auto',
                            paddingTop: 12,
                        }}
                    >
                        <span>{messages('reportConfigs.importResult.sourceFile', { file: jobStatus.file })}</span>
                        {jobStatus.durationMs > 0 && (
                            <span>
                                {messages('reportConfigs.importResult.duration', { duration: (jobStatus.durationMs / 1000).toFixed(2) })}
                            </span>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};
