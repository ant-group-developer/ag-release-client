import { useApiNotify } from '@/hooks/use-api-notify';
import { DeleteVariables } from '@/types/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { releaseExecutionApis } from '../apis';
import { releaseExecutionQueryKeys } from '../constants/query-keys';

export const useRetryReleaseExecution = () => {
    const { handleError, handleSuccess } = useApiNotify();
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationKey: releaseExecutionQueryKeys.retry(),
        mutationFn: ({ id }: DeleteVariables<string>) =>
            releaseExecutionApis.retry(id),
        onSuccess: (data, { onSuccess, id }) => {
            handleSuccess(data?.data);
            onSuccess?.();
            queryClient.invalidateQueries({
                queryKey: releaseExecutionQueryKeys.getList(),
            });
            queryClient.invalidateQueries({
                queryKey: releaseExecutionQueryKeys.detail(id),
            });
        },
        onError: (error, { onError }) => {
            handleError(error);
            onError?.(error);
        },
    });

    const retryReleaseExecution = (variables: DeleteVariables<string>) => {
        return mutation.mutateAsync(variables);
    };

    return {
        retryReleaseExecution,
        ...mutation,
    };
};
