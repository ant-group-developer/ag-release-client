import { useApiNotify } from '@/hooks/use-api-notify';
import { releasesQueryKeys } from '@/modules/releases/constants/query-keys';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { releaseDspApis } from '../apis';
import { releaseDspQueryKey } from '../constants/query-keys';
import { SyncStatusFromCiPayload } from '../types/payloads';

export const useSyncStatusFromCi = () => {
    const { handleError, handleSuccess } = useApiNotify();
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: ({ releaseId }: SyncStatusFromCiPayload) =>
            releaseDspApis.syncStatusFromCi(releaseId),
        onSuccess(data, variables) {
            handleSuccess(data);
            queryClient.invalidateQueries({
                queryKey: [releaseDspQueryKey.all],
            });
            if (variables?.releaseId) {
                queryClient.invalidateQueries({
                    queryKey: releasesQueryKeys.detail(variables.releaseId),
                });
                queryClient.invalidateQueries({
                    queryKey: releasesQueryKeys.lists(),
                });
            }
            variables?.onSuccess?.(data);
        },
        onError(error, variables) {
            handleError(error);
            variables?.onError?.(error);
        },
    });

    const syncStatusFromCi = (payload: SyncStatusFromCiPayload) => {
        return mutation.mutateAsync(payload);
    };

    return {
        syncStatusFromCi,
        ...mutation,
    };
};
