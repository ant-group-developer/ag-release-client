import { theme } from 'antd';
import { useTranslations } from 'next-intl';
import React from 'react';
import { FileUploadStatus, PreValidateImportResponse } from '../../types/payload';

interface ImportValidationUploadBannerProps {
    validationResult: PreValidateImportResponse;
    isUploading: boolean;
    uploadStatus: FileUploadStatus;
    uploadError: string | null;
}

export const ImportValidationUploadBanner: React.FC<ImportValidationUploadBannerProps> = ({
    validationResult,
    isUploading,
    uploadStatus,
    uploadError,
}) => {
    const messages = useTranslations();
    const { token } = theme.useToken();

    if (
        !(validationResult.matched?.length > 0 &&
        (isUploading || uploadStatus === FileUploadStatus.FAILED))
    ) {
        return null;
    }

    return (
        <div
            className="p-4"
            style={{
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
                className="font-semibold"
                style={{
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
                    className="mt-2 text-[13px]"
                    style={{
                        color: token.colorErrorText,
                    }}
                >
                    {messages('reportConfigs.importResult.errorDetails')}: {uploadError}
                </div>
            )}
        </div>
    );
};
