import { CommonFunction } from '@/types/api';
import {
    AssetImportAction,
    AssetImportChangeType,
    AssetImportMatchType,
    AssetImportItemStatus,
} from '../enums';
import { AssetImportBatchData } from './index';

/** ---------- Presign upload ---------- */
export interface PresignUploadPayload {
    fileName: string;
    contentType: string;
}

export interface PresignUploadResponse {
    r2Key: string;
    uploadUrl: string;
    expiresIn: number;
}

/** ---------- Scan ---------- */
export interface ScanAssetImportOptions {
    updateOwnership?: boolean;
    overwriteMetadata?: boolean;
    createIfNotFound?: boolean;
    fillEmptyOnly?: boolean;
    createLabelIfMissing?: boolean;
}

export interface ScanAssetImportPayload {
    r2Key: string;
    targetTenantId: string;
    options?: ScanAssetImportOptions;
}

export interface ScanAssetImportResponse {
    batchId: string;
    status?: string;
}

/** ---------- Item detail / changes ---------- */
export interface AssetImportChange {
    field: string;
    label: string;
    newValue: any;
    oldValue: any;
    changeType: AssetImportChangeType | string;
    newDisplay?: string | null;
    oldDisplay?: string | null;
    note?: string | null;
}

export interface AssetImportItemCurrent {
    tenantId?: string | null;
    tenantName?: string | null;
    labelId?: string | null;
    labelName?: string | null;
}

export interface AssetImportItemData {
    id: string;
    batchId: string;
    rowNumber: number;
    isrc?: string | null;
    upc?: string | null;
    trackName?: string | null;
    albumName?: string | null;
    labelName?: string | null;
    matchType: AssetImportMatchType | string;
    action: AssetImportAction | string;
    status: AssetImportItemStatus | string;
    matchedReleaseId?: string | null;
    matchedTrackId?: string | null;
    current?: AssetImportItemCurrent | null;
    changes: AssetImportChange[];
    errorMessage?: string | null;
    appliedAt?: string | null;
}

/** ---------- Apply ---------- */
export interface ApplyAssetImportPayload {
    selectAll: boolean;
    itemIds?: string[];
    excludeItemIds?: string[];
    action?: AssetImportAction | string;
}

export interface ApplyAssetImportResponse {
    message?: string;
    appliedCount?: number;
    failedCount?: number;
}

/** ---------- Mutation variables ---------- */
export interface PresignAssetImportVariables extends CommonFunction {
    payload: PresignUploadPayload;
}

export interface ScanAssetImportVariables extends CommonFunction {
    payload: ScanAssetImportPayload;
}

export interface ApplyAssetImportVariables extends CommonFunction {
    batchId: string;
    payload: ApplyAssetImportPayload;
}

/** ---------- SSE ---------- */
export enum AssetImportEventType {
    SNAPSHOT = 'snapshot',
    PROGRESS = 'progress',
    HEARTBEAT = 'heartbeat',
    COMPLETED = 'completed',
    FAILED = 'failed',
    CANCELLED = 'cancelled',
}

export interface AssetImportEventData {
    type: AssetImportEventType | string;
    batchId?: string;
    message?: string;
    summary?: Partial<AssetImportBatchData>;
    status?: string;
    [key: string]: any;
}
