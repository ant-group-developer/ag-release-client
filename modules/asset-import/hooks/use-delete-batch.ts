import { useApiNotify } from '@/hooks/use-api-notify';
import { DeleteVariables } from '@/types/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { assetImportApis } from '../apis';
import { assetImportBatchQueryKeys } from '../constants/query-keys';

export const useDeleteAssetImportBatch = () => {
    const queryClient = useQueryClient();
    const { handleSuccess, handleError } = useApiNotify();

    const mutation = useMutation({
        mutationFn: ({ id }: DeleteVariables<string>) =>
            assetImportApis.deleteBatch(id),
        onSuccess: (data, { onSuccess }: DeleteVariables<string>) => {
            queryClient.invalidateQueries({
                queryKey: assetImportBatchQueryKeys.lists(),
            });
            handleSuccess(data?.data);
            onSuccess?.();
        },
        onError: (error, { onError }: DeleteVariables<string>) => {
            onError?.();
            handleError(error);
        },
    });

    return {
        deleteAssetImportBatch: mutation.mutate,
        ...mutation,
    };
};
