import { useApiNotify } from '@/hooks/use-api-notify';
import { CreateVariables } from '@/types/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { releasesApi } from '../apis';
import { releasesQueryKeys } from '../constants/query-keys';
import { BulkUpdateReleaseErrorsPayload } from '../types/payload';

export const useBulkUpdateReleaseErrors = () => {
    const queryClient = useQueryClient();
    const { handleError, handleSuccess } = useApiNotify();

    const onSuccess = (
        data: any,
        { onSuccess }: CreateVariables<BulkUpdateReleaseErrorsPayload>
    ) => {
        queryClient.invalidateQueries({
            queryKey: releasesQueryKeys.enrichedErrors(),
        });

        handleSuccess(data?.data);
        onSuccess?.(data?.data?.data);
    };

    const onError = (
        data: any,
        { onError }: CreateVariables<BulkUpdateReleaseErrorsPayload>
    ) => {
        onError?.();
        handleError(data);
    };

    const mutation = useMutation({
        mutationFn: ({
            payload,
        }: CreateVariables<BulkUpdateReleaseErrorsPayload>) =>
            releasesApi.bulkUpdateReleaseErrors(payload),
        onSuccess,
        onError,
    });

    const bulkUpdateReleaseErrors = (
        variables: CreateVariables<BulkUpdateReleaseErrorsPayload>
    ) => {
        return mutation.mutate(variables);
    };

    return {
        bulkUpdateReleaseErrors,
        ...mutation,
    };
};
