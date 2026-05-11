/**
 * Status values for batch import log records.
 * Must stay in sync with the ag-release-server BatchImportLog entity.
 * @see ag-release-server/src/modules/batch-import/enum/batch-import.enum.ts
 */
export enum BatchImportStatus {
	VALIDATING = 'validating',
	VALIDATED = 'validated',
	VALIDATION_FAILED = 'validation_failed',
	UPLOADING = 'uploading',
	UPLOADED = 'uploaded',
	CREATING = 'creating',
	COMPLETED = 'completed',
	FAILED = 'failed',
	SKIPPED = 'skipped',
}
