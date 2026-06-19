import React from 'react';
import { theme } from 'antd';
import { useTranslations } from 'next-intl';
import { FileUploadStatus, PreValidateImportResponse } from '../../types/payload';

interface ImportValidationColumnProps {
    validationResult: PreValidateImportResponse;
    isUploading: boolean;
    uploadStatus: FileUploadStatus;
    uploadError: string | null;
    uploadResults: Record<
        string,
        { status: FileUploadStatus; progress?: number; error?: string }
    >;
    isSideBySide: boolean;
}

export const ImportValidationColumn: React.FC<ImportValidationColumnProps> = ({
    validationResult,
    isUploading,
    uploadStatus,
    uploadError,
    uploadResults,
    isSideBySide,
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
                        {uploadStatus === FileUploadStatus.FAILED && uploadError && (
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
    );
};
