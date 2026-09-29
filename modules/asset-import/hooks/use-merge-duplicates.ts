import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useApiNotify } from '@/hooks/use-api-notify';
import { assetImportApis } from '../apis';
import {
    assetImportBatchQueryKeys,
    assetImportItemQueryKeys,
} from '../constants/query-keys';
import { ApplyAssetImportVariables } from '../types/payload';

export const useMergeAssetImportDuplicates = () => {
    const queryClient = useQueryClient();
    const { handleError } = useApiNotify();

    const mutation = useMutation({
        mutationFn: ({ batchId, payload }: ApplyAssetImportVariables) =>
            assetImportApis.mergeDuplicates(batchId, payload),
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({
                queryKey: assetImportItemQueryKeys.lists(),
            });
            queryClient.invalidateQueries({
                queryKey: assetImportBatchQueryKeys.all,
            });
            variables.onSuccess?.(data?.data);
        },
        onError: (error, variables) => {
            variables.onError?.();
            handleError(error);
        },
    });

    return {
        mergeDuplicates: mutation.mutate,
        ...mutation,
    };
};
