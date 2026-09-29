import { QUERY_KEY } from '@/constants/query-key';
import { useApiNotify } from '@/hooks/use-api-notify';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { releaseMergeApis } from '../apis';
import { releaseMergeQueryKeys } from '../constants/query-keys';
import { ApplyReleaseMergeVariables } from '../types';

export const useApplyReleaseMerge = () => {
    const queryClient = useQueryClient();
    const { handleError, handleSuccess } = useApiNotify();

    const mutation = useMutation({
        mutationFn: ({ scanId, payload }: ApplyReleaseMergeVariables) =>
            releaseMergeApis.apply(scanId, payload),
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({
                queryKey: releaseMergeQueryKeys.detail(variables.scanId),
            });
            queryClient.invalidateQueries({
                queryKey: releaseMergeQueryKeys.lists(),
            });
            queryClient.invalidateQueries({
                queryKey: [
                    ...releaseMergeQueryKeys.all,
                    QUERY_KEY.RELEASE_MERGE.GET_ITEMS,
                    variables.scanId,
                ],
            });
            handleSuccess(data?.data);
            variables.onSuccess?.(data?.data);
        },
        onError: (error, variables) => {
            variables.onError?.();
            handleError(error);
        },
    });

    return {
        applyMerge: mutation.mutate,
        ...mutation,
    };
};
