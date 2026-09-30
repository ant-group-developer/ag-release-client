import { CommonFunction } from '@/types/api';
import {
    AssetImportAction,
    AssetImportChangeType,
    AssetImportItemStatus,
    AssetImportMatchType,
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
    effectiveDate: string;
    revenueEffectiveFrom: string;
    options?: ScanAssetImportOptions;
}

export interface ScanAssetImportResponse {
    batchId: string;
    status?: string;
}

/** ---------- Template ---------- */
export interface TemplateDownloadResponse {
    downloadUrl: string;
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
    requiresMerge?: boolean;
    duplicateClassification?: string | null;
    canonicalReleaseId?: string | null;
    canonicalTrackId?: string | null;
    duplicateSourceReleaseIds?: string[] | null;
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
    retryFailed?: boolean;
    sourceReleaseIds?: string[];
    force?: boolean;
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

/** Release snapshot returned by merge prepare. */
export interface MergeReleaseSnapshot {
    id: string;
    upc: string | null;
    title: string | null;
    type: string;
    tenantId: string;
    labelId: string | null;
    isImportedFromReport: boolean;
    updatedAt: string;
}

export interface MergePairPlan {
    source: MergeReleaseSnapshot;
    target: MergeReleaseSnapshot;
    sharedIsrcs: string[];
    sourceOnlyIsrcs: string[];
    targetOnlyIsrcs: string[];
    sourceTrackCount: number;
    targetTrackCount: number;
    upcEquivalent: boolean;
    autoSafe: boolean;
    reasonCodes: string[];
}

export interface MergeImpactSource {
    sourceReleaseId: string;
    plan: MergePairPlan | null;
    forceEligible: boolean;
    error: string | null;
}

export interface MergeImpactGroup {
    targetReleaseId: string;
    itemIds: string[];
    isrcs: string[];
    sources: MergeImpactSource[];
}

export interface MergeImpactData {
    totalItems: number;
    totalTargets: number;
    groups: MergeImpactGroup[];
}

/** POST merge-duplicates trả ngay job. Kết quả nằm ở SSE `result`. */
export interface MergeDuplicatesJob {
    batchId: string;
    jobId: string;
    totalPairs: number;
}

export interface MergeDuplicatesResult {
    merged: number;
    failed: number;
    rescanned: number;
    errors?: string[];
}

export interface RescanConflictsResult {
    rescanned: number;
    summary: unknown;
}

export interface RescanAssetImportVariables extends CommonFunction {
    batchId: string;
}
