import { useApiNotify } from '@/hooks/use-api-notify';
import { releasesQueryKeys } from '@/modules/releases/constants/query-keys';
import { DeleteVariables } from '@/types/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { releasesApi } from '../apis';
import { ReleasesData } from '../types';

export const useTakedownRelease = () => {
    const queryClient = useQueryClient();
    const { handleError, handleSuccess } = useApiNotify();

    const onSuccess = (
        data: any,
        { onSuccess }: DeleteVariables<ReleasesData['id']>
    ) => {
        queryClient.invalidateQueries({
            queryKey: releasesQueryKeys.details(),
        });
        queryClient.invalidateQueries({
            queryKey: releasesQueryKeys.lists(),
        });

        handleSuccess(data?.data);
        onSuccess?.();
    };

    const onError = (
        data: any,
        { onError }: DeleteVariables<ReleasesData['id']>
    ) => {
        onError?.();
        handleError(data);
    };

    const mutation = useMutation({
        mutationFn: ({ id }: DeleteVariables<ReleasesData['id']>) =>
            releasesApi.takedownRelease(id),
        onSuccess,
        onError,
    });

    const takedownRelease = (
        variables: DeleteVariables<ReleasesData['id']>
    ) => {
        return mutation.mutateAsync(variables);
    };

    return {
        takedownRelease,
        ...mutation,
    };
};
