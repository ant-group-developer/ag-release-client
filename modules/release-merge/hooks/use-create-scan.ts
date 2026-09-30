import { useApiNotify } from '@/hooks/use-api-notify';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { releaseMergeApis } from '../apis';
import { releaseMergeQueryKeys } from '../constants/query-keys';
import { CreateReleaseMergeVariables } from '../types';

export const useCreateReleaseMergeScan = () => {
    const queryClient = useQueryClient();
    const { handleError, handleSuccess } = useApiNotify();

    const mutation = useMutation({
        mutationFn: (_variables: CreateReleaseMergeVariables) =>
            releaseMergeApis.createScan(),
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({
                queryKey: releaseMergeQueryKeys.lists(),
            });
            handleSuccess(data?.data);
            variables.onSuccess?.(data?.data);
        },
        onError: (error, variables) => {
            queryClient.invalidateQueries({
                queryKey: releaseMergeQueryKeys.lists(),
            });
            variables.onError?.();
            handleError(error);
        },
    });

    return {
        createScan: mutation.mutate,
        ...mutation,
    };
};
