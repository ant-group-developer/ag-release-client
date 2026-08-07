import { useApiNotify } from '@/hooks/use-api-notify';
import { useMutation } from '@tanstack/react-query';
import { assetImportApis } from '../apis';
import { PresignAssetImportVariables } from '../types/payload';

export const usePresignAssetImport = () => {
    const { handleError } = useApiNotify();

    const mutation = useMutation({
        mutationFn: ({ payload }: PresignAssetImportVariables) =>
            assetImportApis.getPresignUrl(payload),
        onSuccess: (data, { onSuccess }: PresignAssetImportVariables) => {
            onSuccess?.(data?.data?.data);
        },
        onError: (error, { onError }: PresignAssetImportVariables) => {
            onError?.();
            handleError(error);
        },
    });

    return {
        presignAssetImport: mutation.mutate,
        ...mutation,
    };
};
