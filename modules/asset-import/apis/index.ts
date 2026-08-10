import axiosInstance from '@/api/axios-auth';
import { DetailResponse, SuccessResponse } from '@/types/api';
import {
    AssetImportBatchData,
    AssetImportBatchFilter,
    AssetImportBatchListResponse,
    AssetImportItemFilter,
    AssetImportPaginationMetadata,
} from '../types';
import {
    ApplyAssetImportPayload,
    ApplyAssetImportResponse,
    AssetImportItemData,
    PresignUploadPayload,
    PresignUploadResponse,
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

    getListItems: (batchId: string, params: AssetImportItemFilter) => {
        return axiosInstance.get<DetailResponse<AssetImportItemListResponse>>(
            `${ASSET_IMPORT_API_PATHS.BATCHES}/${batchId}/items`,
            { params }
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
