import { useApiNotify } from '@/hooks/use-api-notify';
import { CreateVariables } from '@/types/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { releasesApi } from '../apis';
import { releasesQueryKeys } from '../constants/query-keys';
import { UpsertReleaseCaptionsPayload } from '../types/payload';

export const useUpsertReleaseCaptions = () => {
    const queryClient = useQueryClient();
    const { handleError, handleSuccess } = useApiNotify();

    const onSuccess = (
        data: any,
        { onSuccess }: CreateVariables<UpsertReleaseCaptionsPayload>
    ) => {
        queryClient.invalidateQueries({
            queryKey: releasesQueryKeys.details(),
        });
        queryClient.invalidateQueries({
            queryKey: releasesQueryKeys.captions(),
        });

        handleSuccess(data?.data);
        onSuccess?.(data?.data?.data);
    };

    const onError = (
        data: any,
        { onError }: CreateVariables<UpsertReleaseCaptionsPayload>
    ) => {
        onError?.();
        handleError(data);
    };

    const mutation = useMutation({
        mutationFn: ({ payload }: CreateVariables<UpsertReleaseCaptionsPayload>) =>
            releasesApi.upsertReleaseCaptions(payload),
        onSuccess,
        onError,
    });

    const upsertReleaseCaptions = (
        variables: CreateVariables<UpsertReleaseCaptionsPayload>
    ) => {
        return mutation.mutate(variables);
    };

    return {
        upsertReleaseCaptions,
        ...mutation,
    };
};
