import { useQuery } from '@tanstack/react-query';
import { assetImportApis } from '../apis';
import { assetImportBatchQueryKeys } from '../constants/query-keys';
import { AssetImportBatchStatus } from '../enums';

const RUNNING_STATUSES = [
    AssetImportBatchStatus.SCANNING,
    AssetImportBatchStatus.APPLYING,
];

export const useGetAssetImportBatch = (
    batchId?: string | null,
    enabled = true
) => {
    const { data, ...res } = useQuery({
        queryKey: assetImportBatchQueryKeys.detail(batchId ?? ''),
        queryFn: () => assetImportApis.getBatch(batchId as string),
        enabled: enabled && !!batchId,
        refetchInterval: (query) => {
            const status = query.state.data?.data?.data?.status;
            return RUNNING_STATUSES.includes(status as AssetImportBatchStatus)
                ? 3000
                : false;
        },
    });

    return {
        batchDetail: data?.data?.data ?? null,
        ...res,
    };
};
