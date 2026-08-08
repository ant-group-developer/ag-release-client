import { QUERY_KEY } from '@/constants/query-key';
import { AssetImportBatchFilter, AssetImportItemFilter } from '../types';

export const assetImportBatchQueryKeys = {
    all: [QUERY_KEY.ASSET_IMPORT_BATCH.KEY] as const,
    lists: () =>
        [
            ...assetImportBatchQueryKeys.all,
            QUERY_KEY.ASSET_IMPORT_BATCH.GET_LIST,
        ] as const,
    list: (params?: AssetImportBatchFilter) =>
        params
            ? ([...assetImportBatchQueryKeys.lists(), params] as const)
            : assetImportBatchQueryKeys.lists(),
};

export const assetImportItemQueryKeys = {
    all: [QUERY_KEY.ASSET_IMPORT_ITEM.KEY] as const,
    lists: () =>
        [
            ...assetImportItemQueryKeys.all,
            QUERY_KEY.ASSET_IMPORT_ITEM.GET_LIST,
        ] as const,
    list: (batchId: string, params?: AssetImportItemFilter) =>
        params
            ? ([
                  ...assetImportItemQueryKeys.lists(),
                  batchId,
                  params,
              ] as const)
            : ([...assetImportItemQueryKeys.lists(), batchId] as const),
};
