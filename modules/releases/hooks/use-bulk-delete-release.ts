import { useApiNotify } from '@/hooks/use-api-notify';
import { CreateVariables } from '@/types/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { releasesApi } from '../apis';
import { releasesQueryKeys } from '../constants/query-keys';
import { BulkDeleteRelease } from '../types/payload';

export const useBulkDeleteRelease = () => {
    const queryClient = useQueryClient();
    const { handleError, handleSuccess } = useApiNotify();

    const onSuccess = (
        data: any,
        { onSuccess }: CreateVariables<BulkDeleteRelease>
    ) => {
        queryClient.invalidateQueries({
            queryKey: releasesQueryKeys.details(),
        });
        queryClient.invalidateQueries({
            queryKey: releasesQueryKeys.lists(),
        });

        handleSuccess(data?.data);
        onSuccess?.(data?.data?.data);
    };

    const onError = (
        data: any,
        { onError }: CreateVariables<BulkDeleteRelease>
    ) => {
        onError?.();
        handleError(data);
    };

    const mutation = useMutation({
        mutationFn: ({ payload }: CreateVariables<BulkDeleteRelease>) =>
            releasesApi.bulkDeleteReleaseDraft(payload.ids),
        onSuccess,
        onError,
    });

    const bulkDeleteRelease = (
        variables: CreateVariables<BulkDeleteRelease>
    ) => {
        return mutation.mutate(variables);
    };

    return {
        bulkDeleteRelease,
        ...mutation,
    };
};
