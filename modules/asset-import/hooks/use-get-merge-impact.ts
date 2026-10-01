import { useQuery } from '@tanstack/react-query';
import { assetImportApis } from '../apis';
import { assetImportBatchQueryKeys } from '../constants/query-keys';

export const useGetMergeImpact = (
    batchId?: string | null,
    enabled = true
) => {
    const { data, ...res } = useQuery({
        queryKey: assetImportBatchQueryKeys.mergeImpact(batchId ?? ''),
        queryFn: () => assetImportApis.getMergeImpact(batchId as string),
        enabled: enabled && !!batchId,
    });

    return {
        mergeImpact: data?.data?.data ?? null,
        ...res,
    };
};
