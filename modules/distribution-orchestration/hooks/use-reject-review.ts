import { useApiNotify } from '@/hooks/use-api-notify';
import { CommonFunction } from '@/types/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { distributionOrchestrationApis } from '../apis';
import { distributionOrchestrationQueryKeys } from '../constants/query-keys';
import { RejectReviewPayload } from '../types';

interface Variables extends CommonFunction {
    id: string;
    payload?: RejectReviewPayload;
}

/** POST /distributions/:id/review/reject — từ chối distribution IN_REVIEW. */
export const useRejectReview = () => {
    const { handleError, handleSuccess } = useApiNotify();
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationKey: distributionOrchestrationQueryKeys.rejectReview(),
        mutationFn: ({ id, payload }: Variables) =>
            distributionOrchestrationApis.rejectReview(id, payload),
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

    const rejectReview = (variables: Variables) =>
        mutation.mutateAsync(variables);

    return { rejectReview, ...mutation };
};
