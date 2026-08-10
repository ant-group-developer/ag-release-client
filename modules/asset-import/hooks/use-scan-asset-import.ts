import { useApiNotify } from '@/hooks/use-api-notify';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { assetImportApis } from '../apis';
import { assetImportBatchQueryKeys } from '../constants/query-keys';
import { ScanAssetImportVariables } from '../types/payload';

export const useScanAssetImport = () => {
    const queryClient = useQueryClient();
    const { handleSuccess, handleError } = useApiNotify();

    const mutation = useMutation({
        mutationFn: ({ payload }: ScanAssetImportVariables) =>
            assetImportApis.scan(payload),
        onSuccess: (data, { onSuccess }: ScanAssetImportVariables) => {
            queryClient.invalidateQueries({
                queryKey: assetImportBatchQueryKeys.lists(),
            });
            handleSuccess(data?.data);
            onSuccess?.(data?.data?.data);
        },
        onError: (error, { onError }: ScanAssetImportVariables) => {
            onError?.();
            handleError(error);
        },
    });

    return {
        scanAssetImport: mutation.mutate,
        ...mutation,
    };
};
