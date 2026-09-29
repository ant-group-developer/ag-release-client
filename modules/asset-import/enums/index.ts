export enum AssetImportBatchStatus {
    SCANNING = 'SCANNING',
    SCANNED = 'SCANNED',
    APPLYING = 'APPLYING',
    APPLIED = 'APPLIED',
    PARTIALLY_APPLIED = 'PARTIALLY_APPLIED',
    FAILED = 'FAILED',
    CANCELLED = 'CANCELLED',
}

export enum AssetImportMatchType {
    ISRC = 'ISRC',
    UPC = 'UPC',
    NONE = 'NONE',
}

export enum AssetImportAction {
    UPDATE = 'UPDATE',
    CREATE = 'CREATE',
    NO_CHANGE = 'NO_CHANGE',
    INVALID = 'INVALID',
    CONFLICT = 'CONFLICT',
    MERGE_REQUIRED = 'MERGE_REQUIRED',
}

export enum AssetImportItemStatus {
    PENDING = 'PENDING',
    APPLIED = 'APPLIED',
    SKIPPED = 'SKIPPED',
    FAILED = 'FAILED',
}

export enum AssetImportChangeType {
    OVERWRITE = 'overwrite',
    FILL_EMPTY = 'fill_empty',
    CREATE = 'create',
    AUTO_SELECT = 'auto_select',
}

export enum FieldOrderAssetImportBatch {
    CREATED_AT = 'batch.createdAt',
    UPDATED_AT = 'batch.updatedAt',
    FILE_NAME = 'batch.fileName',
    STATUS = 'batch.status',
}

export enum FieldOrderAssetImportItem {
    ROW_NUMBER = 'item.rowNumber',
    CREATED_AT = 'item.createdAt',
    ACTION = 'item.action',
    STATUS = 'item.status',
}

/** Batch statuses that mean the batch is still running (used to poll list + know when to keep SSE open) */
export const RUNNING_ASSET_IMPORT_BATCH_STATUSES = [
    AssetImportBatchStatus.SCANNING,
    AssetImportBatchStatus.APPLYING,
];

/** Batch statuses that mean the batch has reached a terminal state (used to stop SSE stream) */
export const TERMINAL_ASSET_IMPORT_BATCH_STATUSES = [
    AssetImportBatchStatus.APPLIED,
    AssetImportBatchStatus.PARTIALLY_APPLIED,
    AssetImportBatchStatus.FAILED,
    AssetImportBatchStatus.CANCELLED,
];

/** Item action/status combos that cannot be selected/applied */
export const NON_SELECTABLE_ASSET_IMPORT_ACTIONS = [
    AssetImportAction.NO_CHANGE,
    AssetImportAction.INVALID,
    AssetImportAction.CONFLICT,
    AssetImportAction.MERGE_REQUIRED,
];

export enum TYPE_MODAL_ASSET_IMPORT {
    SCAN = 'SCAN_ASSET_IMPORT',
    DETAIL = 'DETAIL_ASSET_IMPORT',
    DELETE = 'DELETE_ASSET_IMPORT',
}
