import { useApiNotify } from '@/hooks/use-api-notify';
import { CommonFunction } from '@/types/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { reportConfigApis } from '../apis';
import { etlJobQueryKeys } from '../constants/query-keys';
import { DeleteImportedReleasesPayload } from '../types/payload';

interface DeleteImportedReleasesVariables extends CommonFunction {
    payload: DeleteImportedReleasesPayload;
}

export const useDeleteImportedReleases = () => {
    const queryClient = useQueryClient();
    const { handleSuccess, handleError } = useApiNotify();

    const mutation = useMutation({
        mutationFn: ({ payload }: DeleteImportedReleasesVariables) =>
            reportConfigApis.deleteImportedReleases(payload),
        onSuccess: (data, { onSuccess }: DeleteImportedReleasesVariables) => {
            queryClient.invalidateQueries({
                queryKey: etlJobQueryKeys.all,
            });
            handleSuccess(data?.data);
            onSuccess?.(data?.data);
        },
        onError: (error, { onError }: DeleteImportedReleasesVariables) => {
            onError?.();
            handleError(error);
        },
    });

    return {
        deleteImportedReleases: mutation.mutate,
        ...mutation,
    };
};

export type { DeleteImportedReleasesVariables };
