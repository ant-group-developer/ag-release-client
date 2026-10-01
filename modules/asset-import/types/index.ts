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
    /** Object key của file Excel đã scan, nằm trong bucket R2. */
    fileKey?: string | null;
    /** URL tải file đã scan. Hết hạn sau vài giờ, lấy lại bằng cách tải list/detail. */
    downloadUrl?: string | null;
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

export interface AssetImportBatchSummary {
    byAction: Record<string, number>;
    byStatus: Record<string, number>;
}

/** GET /asset-import/batches/:batchId — batch kèm bộ đếm theo action/status. */
export interface AssetImportBatchDetail {
    id: string;
    fileName?: string;
    fileKey?: string | null;
    downloadUrl?: string | null;
    status: AssetImportBatchStatus | string;
    totalRows?: number;
    matchedRows?: number;
    newRows?: number;
    invalidRows?: number;
    appliedRows?: number;
    failedRows?: number;
    summary?: AssetImportBatchSummary;
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
