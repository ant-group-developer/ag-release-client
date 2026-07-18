import React from 'react';
import { Button } from 'antd';
import { useTranslations } from 'next-intl';
import { FileUploadStatus, PreValidateImportResponse } from '../../types/payload';

interface ImportModalFooterProps {
    validationResult: PreValidateImportResponse;
    isUploading: boolean;
    isJobProcessing: boolean;
    uploadStatus: FileUploadStatus;
    onGoBack: () => void;
    onRetry: () => void;
    onClose: () => void;
    readOnly?: boolean;
}

export const ImportModalFooter: React.FC<ImportModalFooterProps> = ({
    validationResult,
    isUploading,
    isJobProcessing,
    uploadStatus,
    onGoBack,
    onRetry,
    onClose,
    readOnly = false,
}) => {
    const messages = useTranslations();

    return (
        <>
            {!readOnly && !isUploading && !isJobProcessing && (
                <Button key="back" onClick={onGoBack}>
                    {messages('common.back')}
                </Button>
            )}
            {!readOnly &&
                !isUploading &&
                !isJobProcessing &&
                uploadStatus === FileUploadStatus.FAILED &&
                (validationResult.matched || []).length > 0 && (
                    <Button
                        key="retry"
                        type="primary"
                        onClick={onRetry}
                    >
                        {messages('common.retry')}
                    </Button>
                )}
            <Button
                key="close"
                type={uploadStatus === FileUploadStatus.SUCCESS ? 'primary' : 'default'}
                loading={isUploading}
                onClick={onClose}
            >
                {messages('common.close')}
            </Button>
        </>
    );
};
