import React from 'react';
import {
    FileUploadStatus,
    ImportJobStatusResponse,
    PreValidateImportResponse,
    RUNNING_IMPORT_JOB_STATUSES,
} from '../../types/payload';
import { ImportValidationColumn } from './import-validation-column';
import { ImportJobColumn } from './import-job-column';

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
    const showLeftColumn = !readOnly;
    const showRightColumn = !!(startedJobId && jobStatus);
    const isSideBySide = showLeftColumn && showRightColumn;
    const isJobProcessing = !!(
        jobStatus?.status &&
        RUNNING_IMPORT_JOB_STATUSES.includes(jobStatus.status)
    );

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
                <ImportValidationColumn
                    validationResult={validationResult}
                    isUploading={isUploading}
                    uploadStatus={uploadStatus}
                    uploadError={uploadError}
                    uploadResults={uploadResults}
                    isSideBySide={isSideBySide}
                />
            )}

            {/* Right Column: Job Processing Status Panel */}
            {showRightColumn && jobStatus && (
                <ImportJobColumn
                    jobStatus={jobStatus}
                    validationResult={validationResult}
                />
            )}
        </div>
    );
};
