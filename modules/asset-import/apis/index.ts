import axiosInstance from '@/api/axios-auth';
import { DetailResponse, SuccessResponse } from '@/types/api';
import {
    AssetImportBatchData,
    AssetImportBatchDetail,
    AssetImportBatchFilter,
    AssetImportBatchListResponse,
    AssetImportItemFilter,
    AssetImportPaginationMetadata,
} from '../types';
import {
    ApplyAssetImportPayload,
    ApplyAssetImportResponse,
    AssetImportItemData,
    MergeDuplicatesJob,
    MergeImpactData,
    PresignUploadPayload,
    PresignUploadResponse,
    RescanConflictsResult,
    TemplateDownloadResponse,
    ScanAssetImportPayload,
    ScanAssetImportResponse,
} from '../types/payload';

const ASSET_IMPORT_API_PATHS = {
    PRESIGN: '/asset-import/uploads/presign',
    SCAN: '/asset-import/scan',
    TEMPLATE_DOWNLOAD: '/asset-import/template/download',
    BATCHES: '/asset-import/batches',
} as const;

export interface AssetImportItemListResponse {
    items: AssetImportItemData[];
    metadata: AssetImportPaginationMetadata;
}

export const assetImportApis = {
    getPresignUrl: (payload: PresignUploadPayload) => {
        return axiosInstance.post<DetailResponse<PresignUploadResponse>>(
            ASSET_IMPORT_API_PATHS.PRESIGN,
            payload
        );
    },

    scan: (payload: ScanAssetImportPayload) => {
        return axiosInstance.post<DetailResponse<ScanAssetImportResponse>>(
            ASSET_IMPORT_API_PATHS.SCAN,
            payload
        );
    },

    downloadTemplate: () => {
        return axiosInstance.get<DetailResponse<TemplateDownloadResponse>>(
            ASSET_IMPORT_API_PATHS.TEMPLATE_DOWNLOAD
        );
    },

    getListBatches: (params: AssetImportBatchFilter) => {
        return axiosInstance.get<DetailResponse<AssetImportBatchListResponse>>(
            ASSET_IMPORT_API_PATHS.BATCHES,
            { params }
        );
    },

    getBatch: (batchId: string) => {
        return axiosInstance.get<DetailResponse<AssetImportBatchDetail>>(
            `${ASSET_IMPORT_API_PATHS.BATCHES}/${batchId}`
        );
    },

    getListItems: (batchId: string, params: AssetImportItemFilter) => {
        return axiosInstance.get<DetailResponse<AssetImportItemListResponse>>(
            `${ASSET_IMPORT_API_PATHS.BATCHES}/${batchId}/items`,
            { params }
        );
    },

    getMergeImpact: (batchId: string) => {
        return axiosInstance.get<DetailResponse<MergeImpactData>>(
            `${ASSET_IMPORT_API_PATHS.BATCHES}/${batchId}/merge-impact`
        );
    },

    mergeDuplicates: (batchId: string, payload: ApplyAssetImportPayload) => {
        return axiosInstance.post<DetailResponse<MergeDuplicatesJob>>(
            `${ASSET_IMPORT_API_PATHS.BATCHES}/${batchId}/merge-duplicates`,
            payload
        );
    },

    rescanConflicts: (batchId: string) => {
        return axiosInstance.post<DetailResponse<RescanConflictsResult>>(
            `${ASSET_IMPORT_API_PATHS.BATCHES}/${batchId}/rescan-conflicts`
        );
    },

    apply: (batchId: string, payload: ApplyAssetImportPayload) => {
        return axiosInstance.post<DetailResponse<ApplyAssetImportResponse>>(
            `${ASSET_IMPORT_API_PATHS.BATCHES}/${batchId}/apply`,
            payload
        );
    },

    deleteBatch: (batchId: string) => {
        return axiosInstance.delete<SuccessResponse>(
            `${ASSET_IMPORT_API_PATHS.BATCHES}/${batchId}`
        );
    },
};

export { ASSET_IMPORT_API_PATHS };
export type { AssetImportBatchData };
