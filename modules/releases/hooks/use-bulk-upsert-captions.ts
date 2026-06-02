import { useApiNotify } from '@/hooks/use-api-notify';
import { CreateVariables } from '@/types/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { releasesApi } from '../apis';
import { releasesQueryKeys } from '../constants/query-keys';
import { BulkUpsertCaptionsPayload } from '../types/payload';

export const useBulkUpsertCaptions = () => {
    const queryClient = useQueryClient();
    const { handleError, handleSuccess } = useApiNotify();

    const onSuccess = (
        data: any,
        { onSuccess }: CreateVariables<BulkUpsertCaptionsPayload>
    ) => {
        queryClient.invalidateQueries({
            queryKey: releasesQueryKeys.details(),
        });

        handleSuccess(data?.data);
        onSuccess?.(data?.data?.data);
    };

    const onError = (
        data: any,
        { onError }: CreateVariables<BulkUpsertCaptionsPayload>
    ) => {
        onError?.();
        handleError(data);
    };

    const mutation = useMutation({
        mutationFn: ({ payload }: CreateVariables<BulkUpsertCaptionsPayload>) =>
            releasesApi.bulkUpsertCaptions(payload),
        onSuccess,
        onError,
    });

    const bulkUpsertCaptions = (
        variables: CreateVariables<BulkUpsertCaptionsPayload>
    ) => {
        return mutation.mutate(variables);
    };

    return {
        bulkUpsertCaptions,
        ...mutation,
    };
};
