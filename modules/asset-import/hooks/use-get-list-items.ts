import { useQuery } from '@tanstack/react-query';
import { assetImportApis, AssetImportItemListResponse } from '../apis';
import { assetImportItemQueryKeys } from '../constants/query-keys';
import { AssetImportItemFilter } from '../types';

const DEFAULT_ASSET_IMPORT_ITEM_LIST: AssetImportItemListResponse = {
    items: [],
    metadata: {
        page: 1,
        pageSize: 0,
        totalItems: 0,
        totalPages: 0,
    },
};

export const useGetListAssetImportItem = (
    batchId?: string | null,
    params?: AssetImportItemFilter,
    waitForItems = false
) => {
    const { data, ...res } = useQuery({
        queryKey: assetImportItemQueryKeys.list(batchId as string, params),
        queryFn: () =>
            assetImportApis.getListItems(batchId as string, params ?? {}),
        enabled: !!batchId,
        refetchInterval: (query) => {
            const itemData = query.state.data?.data?.data;
            const hasItems =
                (itemData?.items?.length ?? 0) > 0 ||
                (itemData?.metadata?.totalItems ?? 0) > 0;

            return waitForItems && !hasItems ? 2000 : false;
        },
        placeholderData: (prev) => prev,
    });

    const assetImportItemData =
        data?.data?.data ?? DEFAULT_ASSET_IMPORT_ITEM_LIST;

    return {
        assetImportItemData,
        ...res,
    };
};
