import { useApiNotify } from '@/hooks/use-api-notify';
import { CommonFunction } from '@/types/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { distributionOrchestrationApis } from '../apis';
import { distributionOrchestrationQueryKeys } from '../constants/query-keys';
import { ApproveReviewPayload } from '../types';

interface Variables extends CommonFunction {
    id: string;
    payload?: ApproveReviewPayload;
}

/** POST /distributions/:id/review/approve — duyệt distribution IN_REVIEW. */
export const useApproveReview = () => {
    const { handleError, handleSuccess } = useApiNotify();
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationKey: distributionOrchestrationQueryKeys.approveReview(),
        mutationFn: ({ id, payload }: Variables) =>
            distributionOrchestrationApis.approveReview(id, payload),
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

    const approveReview = (variables: Variables) =>
        mutation.mutateAsync(variables);

    return { approveReview, ...mutation };
};
