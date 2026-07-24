import { useApiNotify } from '@/hooks/use-api-notify';
import { CommonFunction } from '@/types/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { distributionOrchestrationApis } from '../apis';
import { distributionOrchestrationQueryKeys } from '../constants/query-keys';
import { RetryDistributionPayload } from '../types';

interface Variables extends CommonFunction {
    id: string;
    payload?: RetryDistributionPayload;
}

/**
 * POST /distributions/:id/retry — reset subtree ISSUES → resume.
 * Poison (retryCount≥3) → server trả 409 → handleError hiển thị.
 */
export const useRetryDistribution = () => {
    const { handleError, handleSuccess } = useApiNotify();
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationKey: distributionOrchestrationQueryKeys.retry(),
        mutationFn: ({ id, payload }: Variables) =>
            distributionOrchestrationApis.retry(id, payload),
        onSuccess: (data, { id, onSuccess }) => {
            handleSuccess(data?.data);
            onSuccess?.();
            queryClient.invalidateQueries({
                queryKey: [
                    ...distributionOrchestrationQueryKeys.timelines(),
                    id,
                ],
            });
        },
        onError: (error, { onError }) => {
            handleError(error);
            onError?.(error);
        },
    });

    const retryDistribution = (variables: Variables) =>
        mutation.mutateAsync(variables);

    return { retryDistribution, ...mutation };
};
