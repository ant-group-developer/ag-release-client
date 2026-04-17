import { useApiNotify } from '@/hooks/use-api-notify';
import { trackQueryKeys } from '@/modules/tracks/constants/query-keys';
import { CreateVariables } from '@/types/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { trackContributorApi } from '../apis';
import { trackContributorQueryKeys } from '../constants/query-keys';
import { BulkCreateTrackContributorPayload } from '../types/payload';

export const useBulkCreateTrackContributor = () => {
    const queryClient = useQueryClient();
    const { handleError } = useApiNotify();

    const onSuccess = (
        data: any,
        {
            onSuccess,
            payload,
        }: CreateVariables<BulkCreateTrackContributorPayload>
    ) => {
        queryClient.invalidateQueries({
            queryKey: trackContributorQueryKeys.lists(),
        });
        queryClient.invalidateQueries({
            queryKey: trackQueryKeys.detail(payload.items[0].trackId),
        });

        onSuccess?.(data?.data?.data);
    };

    const onError = (
        data: any,
        { onError }: CreateVariables<BulkCreateTrackContributorPayload>
    ) => {
        handleError(data);

        onError?.();
    };

    const mutation = useMutation({
        mutationFn: ({
            payload,
        }: CreateVariables<BulkCreateTrackContributorPayload>) =>
            trackContributorApi.bulkCreate(payload),
        onSuccess,
        onError,
    });

    const bulkCreateTrackContributor = (
        variables: CreateVariables<BulkCreateTrackContributorPayload>
    ) => {
        return mutation.mutateAsync(variables);
    };

    return {
        bulkCreateTrackContributor,
        ...mutation,
    };
};
