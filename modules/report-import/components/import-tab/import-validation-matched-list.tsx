import { theme } from 'antd';
import { useTranslations } from 'next-intl';
import React from 'react';
import {
    FileUploadStatus,
    PreValidateImportResponse,
} from '../../types/payload';

interface ImportValidationMatchedListProps {
    validationResult: PreValidateImportResponse;
    uploadResults: Record<
        string,
        { status: FileUploadStatus; progress?: number; error?: string }
    >;
    isSideBySide: boolean;
}

export const ImportValidationMatchedList: React.FC<
    ImportValidationMatchedListProps
> = ({ validationResult, uploadResults, isSideBySide }) => {
    const messages = useTranslations();
    const { token } = theme.useToken();

    if (!(validationResult.matched?.length > 0)) {
        return null;
    }

    const hasInvalid =
        validationResult.invalid && validationResult.invalid.length > 0;
    const maxHeight = hasInvalid
        ? isSideBySide
            ? 300
            : 200
        : isSideBySide
          ? 550
          : 400;

    return (
        <div>
            <h4
                className="mb-2 font-semibold"
                style={{
                    color: token.colorText,
                }}
            >
                {messages('reportConfigs.importResult.validFiles', {
                    count: validationResult.matched.length,
                })}
            </h4>
            <div
                className="flex flex-col px-4 py-2"
                style={{
                    maxHeight,
                    overflowY: 'auto',
                    border: `1px solid ${token.colorBorderSecondary}`,
                    borderRadius: token.borderRadiusLG,
                    backgroundColor: token.colorBgLayout,
                }}
            >
                {validationResult.matched.map((item: any, idx: number) => {
                    const result = uploadResults[item.path];
                    return (
                        <div
                            key={idx}
                            className="flex items-center justify-between gap-3 py-2"
                            style={{
                                borderBottom:
                                    idx < validationResult.matched.length - 1
                                        ? `1px solid ${token.colorBorderSecondary}`
                                        : 'none',
                            }}
                        >
                            <span
                                className="break-all text-[13px] font-medium"
                                style={{
                                    color: token.colorText,
                                }}
                            >
                                {item.path}
                            </span>
                            <span className="shrink-0 text-xs">
                                {result?.status ===
                                    FileUploadStatus.UPLOADING && (
                                    <span
                                        style={{
                                            color: token.colorPrimary,
                                        }}
                                    >
                                        {messages(
                                            'reportConfigs.importResult.uploading'
                                        )}
                                        {result.progress !== undefined &&
                                            ` (${result.progress}%)`}
                                    </span>
                                )}
                                {result?.status ===
                                    FileUploadStatus.SUCCESS && (
                                    <span
                                        style={{
                                            color: token.colorSuccess,
                                        }}
                                    >
                                        {messages(
                                            'reportConfigs.importResult.uploadSuccess'
                                        )}
                                    </span>
                                )}
                                {result?.status === FileUploadStatus.FAILED && (
                                    <span
                                        style={{
                                            color: token.colorError,
                                        }}
                                        title={result.error}
                                    >
                                        {messages(
                                            'reportConfigs.importResult.uploadFailed'
                                        )}
                                    </span>
                                )}
                                {!result && (
                                    <span
                                        style={{
                                            color: token.colorTextDescription,
                                        }}
                                    >
                                        {messages(
                                            'reportConfigs.importResult.awaitingUpload'
                                        )}
                                    </span>
                                )}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
