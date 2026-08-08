import { useQuery } from '@tanstack/react-query';
import { assetImportApis } from '../apis';
import { assetImportBatchQueryKeys } from '../constants/query-keys';
import { RUNNING_ASSET_IMPORT_BATCH_STATUSES } from '../enums';
import { AssetImportBatchFilter, AssetImportBatchListResponse } from '../types';

const DEFAULT_ASSET_IMPORT_BATCH_LIST: AssetImportBatchListResponse = {
    items: [],
    metadata: {
        page: 1,
        pageSize: 0,
        totalItems: 0,
        totalPages: 0,
    },
};

export const useGetListAssetImportBatch = (
    params: AssetImportBatchFilter
) => {
    const { data, ...res } = useQuery({
        queryKey: assetImportBatchQueryKeys.list(params),
        queryFn: () => assetImportApis.getListBatches(params),
        placeholderData: (prev) => prev,
        refetchInterval: (query) => {
            const items = query.state.data?.data?.data?.items ?? [];
            const hasRunningBatch = items.some((item) =>
                RUNNING_ASSET_IMPORT_BATCH_STATUSES.includes(item.status as any)
            );

            return hasRunningBatch ? 5000 : false;
        },
    });

    const assetImportBatchData =
        data?.data?.data ?? DEFAULT_ASSET_IMPORT_BATCH_LIST;

    return {
        assetImportBatchData,
        ...res,
    };
};
