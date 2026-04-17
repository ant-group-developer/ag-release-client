import { useApiNotify } from '@/hooks/use-api-notify';
import { releasesQueryKeys } from '@/modules/releases/constants/query-keys';
import { CreateVariables } from '@/types/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { releaseContributorApi } from '../apis';
import { releaseContributorQueryKeys } from '../constants/query-keys';
import { BulkCreateReleaseContributorPayload } from '../types/payload';

export const useBulkCreateReleaseContributor = () => {
    const queryClient = useQueryClient();
    const { handleError } = useApiNotify();

    const onSuccess = (
        data: any,
        { onSuccess }: CreateVariables<BulkCreateReleaseContributorPayload>
    ) => {
        queryClient.invalidateQueries({
            queryKey: releaseContributorQueryKeys.lists(),
        });
        queryClient.invalidateQueries({
            queryKey: releasesQueryKeys.details(),
        });
        onSuccess?.(data?.data?.data);
    };

    const onError = (
        data: any,
        { onError }: CreateVariables<BulkCreateReleaseContributorPayload>
    ) => {
        handleError(data);

        onError?.();
    };
    const mutation = useMutation({
        mutationFn: ({
            payload,
        }: CreateVariables<BulkCreateReleaseContributorPayload>) =>
            releaseContributorApi.bulkCreate(payload),
        onSuccess,
        onError,
    });

    const bulkCreateReleaseContributor = (
        variables: CreateVariables<BulkCreateReleaseContributorPayload>
    ) => {
        return mutation.mutateAsync(variables);
    };

    return {
        bulkCreateReleaseContributor,
        ...mutation,
    };
};
