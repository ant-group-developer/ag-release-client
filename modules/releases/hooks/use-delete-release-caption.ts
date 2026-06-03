import { useApiNotify } from '@/hooks/use-api-notify';
import { CreateVariables } from '@/types/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { releasesApi } from '../apis';
import { releasesQueryKeys } from '../constants/query-keys';

export const useDeleteReleaseCaption = () => {
    const queryClient = useQueryClient();
    const { handleError, handleSuccess } = useApiNotify();

    const onSuccess = (data: any, { onSuccess }: CreateVariables<string>) => {
        queryClient.invalidateQueries({
            queryKey: releasesQueryKeys.details(),
        });
        queryClient.invalidateQueries({
            queryKey: releasesQueryKeys.captions(),
        });

        handleSuccess(data?.data);
        onSuccess?.(data?.data?.data);
    };

    const onError = (data: any, { onError }: CreateVariables<string>) => {
        onError?.();
        handleError(data);
    };

    const mutation = useMutation({
        mutationFn: ({ payload }: CreateVariables<string>) =>
            releasesApi.deleteReleaseCaption(payload),
        onSuccess,
        onError,
    });

    const deleteReleaseCaption = (variables: CreateVariables<string>) => {
        return mutation.mutate(variables);
    };

    return {
        deleteReleaseCaption,
        ...mutation,
    };
};
