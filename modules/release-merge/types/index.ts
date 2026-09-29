import { CommonAttribute, CommonFunction, CommonParams } from '@/types/api';
import {
    ReleaseMergeItemClassification,
    ReleaseMergeItemStatus,
    ReleaseMergeRunStatus,
    ReleaseMergeTrigger,
} from '../enums';

export interface ReleaseMergeRun extends CommonAttribute {
    trigger: ReleaseMergeTrigger | string;
    status: ReleaseMergeRunStatus | string;
    requestedBy: string | null;
    totalCandidates: number;
    autoSafeCandidates: number;
    manualCandidates: number;
    appliedCandidates: number;
    failedCandidates: number;
    errorMessage: string | null;
    completedAt: string | null;
}

export interface ReleaseMergeItem extends CommonAttribute {
    runId: string;
    sourceReleaseId: string;
    targetReleaseId: string | null;
    candidateTargetReleaseIds: string[];
    classification: ReleaseMergeItemClassification | string;
    status: ReleaseMergeItemStatus | string;
    reasonCodes: string[];
    sharedIsrcs: string[];
    sourceOnlyIsrcs: string[];
    targetOnlyIsrcs: string[];
    sourceTrackCount: number;
    targetTrackCount: number;
    upcEquivalent: boolean;
    snapshot: Record<string, unknown>;
    appliedBy: string | null;
    appliedAt: string | null;
    errorMessage: string | null;
}

export interface ReleaseMergePagination {
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
}

export interface ReleaseMergeList<T> {
    items: T[];
    metadata: ReleaseMergePagination;
}

export type ReleaseMergeRunFilter = CommonParams;

export interface ReleaseMergeItemFilter extends CommonParams {
    classification?: ReleaseMergeItemClassification | string;
    status?: ReleaseMergeItemStatus | string;
    targetReleaseId?: string;
}

export interface ApplyReleaseMergePayload {
    selectAll: boolean;
    itemIds?: string[];
    excludeItemIds?: string[];
}

export interface ApplyReleaseMergeResult {
    runId: string;
    totalSelected: number;
}

export interface CreateReleaseMergeVariables extends CommonFunction {}

export interface ApplyReleaseMergeVariables extends CommonFunction {
    scanId: string;
    payload: ApplyReleaseMergePayload;
}
