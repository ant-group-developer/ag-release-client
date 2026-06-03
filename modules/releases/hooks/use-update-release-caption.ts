import { useApiNotify } from '@/hooks/use-api-notify';
import { CreateVariables } from '@/types/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { releasesApi } from '../apis';
import { releasesQueryKeys } from '../constants/query-keys';
import { UpdateReleaseCaptionPayload } from '../types/payload';

export const useUpdateReleaseCaption = () => {
    const queryClient = useQueryClient();
    const { handleError, handleSuccess } = useApiNotify();

    const onSuccess = (
        data: any,
        { onSuccess }: CreateVariables<UpdateReleaseCaptionPayload>
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
        { onError }: CreateVariables<UpdateReleaseCaptionPayload>
    ) => {
        onError?.();
        handleError(data);
    };

    const mutation = useMutation({
        mutationFn: ({ payload }: CreateVariables<UpdateReleaseCaptionPayload>) =>
            releasesApi.updateReleaseCaption(payload),
        onSuccess,
        onError,
    });

    const updateReleaseCaption = (
        variables: CreateVariables<UpdateReleaseCaptionPayload>
    ) => {
        return mutation.mutate(variables);
    };

    return {
        updateReleaseCaption,
        ...mutation,
    };
};
