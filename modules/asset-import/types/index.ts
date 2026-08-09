import { CommonAttribute, CommonParams } from '@/types/api';
import {
    AssetImportAction,
    AssetImportBatchStatus,
    AssetImportItemStatus,
    AssetImportMatchType,
} from '../enums';

export interface AssetImportTargetTenant {
    id: string;
    name: string;
    title?: string | null;
    code?: string | null;
    icon?: string | null;
}

export interface AssetImportBatchData extends CommonAttribute {
    fileName: string;
    r2Key?: string;
    targetTenantId: string;
    targetTenant: AssetImportTargetTenant;
    status: AssetImportBatchStatus | string;
    totalRows: number;
    matchedRows: number;
    newRows?: number;
    invalidRows?: number;
    appliedRows: number;
    failedRows?: number;
    errorMessage?: string | null;
    createdBy?: string | null;
    /** Used only by the client to refresh items immediately after a scan. */
    waitForItems?: boolean;
}

export interface AssetImportBatchFilter extends CommonParams {
    status?: AssetImportBatchStatus | string;
    targetTenantId?: string;
}

export interface AssetImportItemFilter extends CommonParams {
    action?: AssetImportAction | string;
    status?: AssetImportItemStatus | string;
    matchType?: AssetImportMatchType | string;
}

export interface AssetImportPaginationMetadata {
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
}

export interface AssetImportBatchListResponse {
    items: AssetImportBatchData[];
    metadata: AssetImportPaginationMetadata;
}
