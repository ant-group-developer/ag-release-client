import { useApiNotify } from '@/hooks/use-api-notify';
import { CreateVariables } from '@/types/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { releasesApi } from '../apis';
import { releasesQueryKeys } from '../constants/query-keys';
import { BulkReleaseReviewPayload } from '../types/payload';

export const useBulkReleaseReview = () => {
    const queryClient = useQueryClient();
    const { handleError, handleSuccess } = useApiNotify();

    const onSuccess = (
        data: any,
        { onSuccess }: CreateVariables<BulkReleaseReviewPayload>
    ) => {
        queryClient.invalidateQueries({
            queryKey: releasesQueryKeys.lists(),
        });
        queryClient.invalidateQueries({
            queryKey: releasesQueryKeys.releaseReviews(),
        });
        queryClient.invalidateQueries({
            queryKey: releasesQueryKeys.statusCounts(),
        });

        handleSuccess(data?.data);
        onSuccess?.(data?.data?.data);
    };

    const onError = (
        data: any,
        { onError }: CreateVariables<BulkReleaseReviewPayload>
    ) => {
        onError?.();
        handleError(data);
    };

    const mutation = useMutation({
        mutationFn: ({ payload }: CreateVariables<BulkReleaseReviewPayload>) =>
            releasesApi.bulkReleaseReview(payload),
        onSuccess,
        onError,
    });

    const bulkReleaseReview = (
        variables: CreateVariables<BulkReleaseReviewPayload>
    ) => {
        return mutation.mutate(variables);
    };

    return {
        bulkReleaseReview,
        ...mutation,
    };
};
