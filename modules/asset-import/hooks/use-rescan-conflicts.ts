import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useApiNotify } from '@/hooks/use-api-notify';
import { assetImportApis } from '../apis';
import {
    assetImportBatchQueryKeys,
    assetImportItemQueryKeys,
} from '../constants/query-keys';
import { RescanAssetImportVariables } from '../types/payload';

export const useRescanAssetImportConflicts = () => {
    const queryClient = useQueryClient();
    const { handleError } = useApiNotify();

    const mutation = useMutation({
        mutationFn: ({ batchId }: RescanAssetImportVariables) =>
            assetImportApis.rescanConflicts(batchId),
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
        rescanConflicts: mutation.mutate,
        ...mutation,
    };
};
