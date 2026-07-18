import React from 'react';
import { FileUploadStatus, PreValidateImportResponse } from '../../types/payload';
import { ImportValidationUploadBanner } from './import-validation-upload-banner';
import { ImportValidationNoMatchedBanner } from './import-validation-no-matched-banner';
import { ImportValidationMatchedList } from './import-validation-matched-list';
import { ImportValidationInvalidList } from './import-validation-invalid-list';

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
    return (
        <div className="flex-1 flex flex-col gap-4 min-w-0">
            {/* Matched Files / Upload Status Banner */}
            <ImportValidationUploadBanner
                validationResult={validationResult}
                isUploading={isUploading}
                uploadStatus={uploadStatus}
                uploadError={uploadError}
            />

            {/* No matched files (validation failed completely) */}
            <ImportValidationNoMatchedBanner
                validationResult={validationResult}
            />

            {/* Matched Files List with Upload Status */}
            <ImportValidationMatchedList
                validationResult={validationResult}
                uploadResults={uploadResults}
                isSideBySide={isSideBySide}
            />

            {/* Invalid Files List */}
            <ImportValidationInvalidList
                validationResult={validationResult}
                isSideBySide={isSideBySide}
            />
        </div>
    );
};
