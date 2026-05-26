import { showNotification } from '@/helpers/messages-helper';
import { useApiNotify } from '@/hooks/use-api-notify';
import { UpdateVariables } from '@/types/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { releaseVideoApi } from '../apis';
import { releaseVideoQueryKeys } from '../constants/query-keys';
import { ReleaseVideoData } from '../types';
import { UpdateReleaseVideoPayload } from '../types/payload';

export const useUpdateReleaseVideo = () => {
    const messages = useTranslations();
    const queryClient = useQueryClient();
    const { handleError } = useApiNotify();

    const onSuccess = (
        data: any,
        { onSuccess }: UpdateVariables<ReleaseVideoData['id'], UpdateReleaseVideoPayload>
    ) => {
        queryClient.invalidateQueries({
            queryKey: releaseVideoQueryKeys.lists(),
        });
        const responseMessages = messages(data?.data?.messageCode || 'message.updateSuccessfully');
        showNotification('success', responseMessages);
        onSuccess?.();
    };

    const onError = (
        data: any,
        { onError }: UpdateVariables<ReleaseVideoData['id'], UpdateReleaseVideoPayload>
    ) => {
        handleError(data);
        onError?.();
    };

    const mutation = useMutation({
        mutationFn: ({
            id,
            payload,
        }: UpdateVariables<ReleaseVideoData['id'], UpdateReleaseVideoPayload>) =>
            releaseVideoApi.update(id, payload),
        onSuccess,
        onError,
    });

    const updateReleaseVideo = (
        variables: UpdateVariables<ReleaseVideoData['id'], UpdateReleaseVideoPayload>
    ) => {
        mutation.mutate(variables);
    };

    return {
        updateReleaseVideo,
        ...mutation,
    };
};
