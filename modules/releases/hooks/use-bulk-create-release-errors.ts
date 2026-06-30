import { useApiNotify } from '@/hooks/use-api-notify';
import { CreateVariables } from '@/types/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { releasesApi } from '../apis';
import { releasesQueryKeys } from '../constants/query-keys';
import { BulkCreateReleaseErrorsPayload } from '../types/payload';

export const useBulkCreateReleaseErrors = () => {
    const queryClient = useQueryClient();
    const { handleError, handleSuccess } = useApiNotify();

    const onSuccess = (
        data: any,
        { onSuccess }: CreateVariables<BulkCreateReleaseErrorsPayload>
    ) => {
        queryClient.invalidateQueries({
            queryKey: releasesQueryKeys.enrichedErrors(),
        });

        handleSuccess(data?.data);
        onSuccess?.(data?.data?.data);
    };

    const onError = (
        data: any,
        { onError }: CreateVariables<BulkCreateReleaseErrorsPayload>
    ) => {
        onError?.();
        handleError(data);
    };

    const mutation = useMutation({
        mutationFn: ({
            payload,
        }: CreateVariables<BulkCreateReleaseErrorsPayload>) =>
            releasesApi.bulkCreateReleaseErrors(payload),
        onSuccess,
        onError,
    });

    const bulkCreateReleaseErrors = (
        variables: CreateVariables<BulkCreateReleaseErrorsPayload>
    ) => {
        return mutation.mutate(variables);
    };

    return {
        bulkCreateReleaseErrors,
        ...mutation,
    };
};
