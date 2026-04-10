import { useApiNotify } from '@/hooks/use-api-notify';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { releaseExecutionApis } from '../apis';
import { releaseExecutionQueryKeys } from '../constants/query-keys';

export const useBulkMarkCompletedReleaseExecution = () => {
    const { handleError, handleSuccess } = useApiNotify();
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: (ids: string[]) =>
            releaseExecutionApis.bulkMarkCompleted(ids),
        onSuccess: (data) => {
            handleSuccess(data?.data);
            queryClient.invalidateQueries({
                queryKey: releaseExecutionQueryKeys.getList(),
            });
        },
        onError: (error) => {
            handleError(error);
        },
    });

    const bulkMarkCompleted = (ids: string[]) => {
        return mutation.mutateAsync(ids);
    };

    return {
        bulkMarkCompleted,
        isPending: mutation.isPending,
    };
};
