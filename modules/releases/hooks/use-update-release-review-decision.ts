import { useApiNotify } from '@/hooks/use-api-notify';
import { UpdateVariables } from '@/types/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { releasesApi } from '../apis';
import { releasesQueryKeys } from '../constants/query-keys';
import { ReleasesData } from '../types';
import { UpdateReleaseReviewDecisionPayload } from '../types/payload';

export const useUpdateReleaseReviewDecision = () => {
    const queryClient = useQueryClient();
    const { handleError, handleSuccess } = useApiNotify();

    const onSuccess = (
        data: any,
        {
            id,
            onSuccess,
        }: UpdateVariables<
            ReleasesData['id'],
            UpdateReleaseReviewDecisionPayload
        >
    ) => {
        queryClient.invalidateQueries({
            queryKey: releasesQueryKeys.detail(id),
        });
        queryClient.invalidateQueries({
            queryKey: releasesQueryKeys.lists(),
        });
        queryClient.invalidateQueries({
            queryKey: releasesQueryKeys.statusCounts(),
        });
        queryClient.invalidateQueries({
            queryKey: releasesQueryKeys.enrichedErrors(),
        });
        queryClient.invalidateQueries({
            queryKey: releasesQueryKeys.releaseReviews(),
        });

        handleSuccess(data?.data);
        onSuccess?.(data?.data?.data);
    };

    const onError = (
        data: any,
        {
            onError,
        }: UpdateVariables<
            ReleasesData['id'],
            UpdateReleaseReviewDecisionPayload
        >
    ) => {
        onError?.();
        handleError(data);
    };

    const mutation = useMutation({
        mutationFn: ({
            id,
            payload,
        }: UpdateVariables<
            ReleasesData['id'],
            UpdateReleaseReviewDecisionPayload
        >) => releasesApi.updateReleaseReviewDecision(id, payload),
        onSuccess,
        onError,
    });

    const updateReleaseReviewDecision = (
        variables: UpdateVariables<
            ReleasesData['id'],
            UpdateReleaseReviewDecisionPayload
        >
    ) => {
        return mutation.mutate(variables);
    };

    return {
        updateReleaseReviewDecision,
        ...mutation,
    };
};
