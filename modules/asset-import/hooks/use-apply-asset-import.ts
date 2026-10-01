import { useApiNotify } from '@/hooks/use-api-notify';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { assetImportApis } from '../apis';
import {
    assetImportBatchQueryKeys,
    assetImportItemQueryKeys,
} from '../constants/query-keys';
import { ApplyAssetImportVariables } from '../types/payload';

export const useApplyAssetImport = () => {
    const queryClient = useQueryClient();
    const { handleSuccess, handleError } = useApiNotify();

    const mutation = useMutation({
        mutationFn: ({ batchId, payload }: ApplyAssetImportVariables) =>
            assetImportApis.apply(batchId, payload),
        onSuccess: (data, { onSuccess }: ApplyAssetImportVariables) => {
            queryClient.invalidateQueries({
                queryKey: assetImportItemQueryKeys.lists(),
            });
            queryClient.invalidateQueries({
                queryKey: assetImportBatchQueryKeys.all,
            });
            handleSuccess(data?.data);
            onSuccess?.(data?.data);
        },
        onError: (error, { onError }: ApplyAssetImportVariables) => {
            onError?.();
            handleError(error);
        },
    });

    return {
        applyAssetImport: mutation.mutate,
        ...mutation,
    };
};
