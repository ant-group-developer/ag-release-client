import { showNotification } from '@/helpers/messages-helper';
import { useApiNotify } from '@/hooks/use-api-notify';
import { CreateVariables } from '@/types/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { releaseVideoApi } from '../apis';
import { releaseVideoQueryKeys } from '../constants/query-keys';
import { CreateReleaseVideoPayload } from '../types/payload';

export const useCreateReleaseVideo = () => {
    const messages = useTranslations();
    const queryClient = useQueryClient();
    const { handleError } = useApiNotify();

    const onSuccess = (
        data: any,
        { onSuccess }: CreateVariables<CreateReleaseVideoPayload>
    ) => {
        queryClient.invalidateQueries({
            queryKey: releaseVideoQueryKeys.lists(),
        });
        const responseMessages = messages(data?.data?.messageCode || 'message.createSuccessfully');
        showNotification('success', responseMessages);
        onSuccess?.();
    };

    const onError = (
        data: any,
        { onError }: CreateVariables<CreateReleaseVideoPayload>
    ) => {
        handleError(data);
        onError?.();
    };

    const mutation = useMutation({
        mutationFn: ({ payload }: CreateVariables<CreateReleaseVideoPayload>) =>
            releaseVideoApi.create(payload),
        onSuccess,
        onError,
    });

    const createReleaseVideo = (variables: CreateVariables<CreateReleaseVideoPayload>) => {
        mutation.mutate(variables);
    };

    return {
        createReleaseVideo,
        ...mutation,
    };
};
