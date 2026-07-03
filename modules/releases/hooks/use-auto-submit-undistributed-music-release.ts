import { useApiNotify } from '@/hooks/use-api-notify';
import { CreateVariables } from '@/types/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { releasesApi } from '../apis';
import { releasesQueryKeys } from '../constants/query-keys';
import { AutoSubmitUndistributedMusicRelease } from '../types/payload';

export const useAutoSubmitUndistributedMusicRelease = (preview = false) => {
    const queryClient = useQueryClient();
    const { handleError, handleSuccess } = useApiNotify();

    const onSuccess = (
        data: any,
        { onSuccess }: CreateVariables<AutoSubmitUndistributedMusicRelease>
    ) => {
        queryClient.invalidateQueries({
            queryKey: releasesQueryKeys.lists(),
        });

        handleSuccess(data?.data);
        onSuccess?.(data?.data?.data);
    };

    const onError = (
        data: any,
        { onError }: CreateVariables<AutoSubmitUndistributedMusicRelease>
    ) => {
        onError?.();
        handleError(data);
    };

    const mutation = useMutation({
        mutationFn: ({
            payload,
        }: CreateVariables<AutoSubmitUndistributedMusicRelease>) =>
            preview
                ? releasesApi.previewAutoSubmitUndistributedMusic(payload)
                : releasesApi.autoSubmitUndistributedMusic(payload),
        onSuccess,
        onError,
    });

    const autoSubmitUndistributedMusicRelease = (
        variables: CreateVariables<AutoSubmitUndistributedMusicRelease>
    ) => {
        return mutation.mutate(variables);
    };

    return {
        autoSubmitUndistributedMusicRelease,
        ...mutation,
    };
};
