import { showNotification } from '@/helpers/messages-helper';
import { useApiNotify } from '@/hooks/use-api-notify';
import { CreateVariables } from '@/types/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { youtubeKeysApi } from '../apis';
import { youtubeKeysQueryKeys } from '../constants/query-keys';
import { CreateYoutubeKeyPayload } from '../types';

export const useCreateYoutubeKey = () => {
    const messages = useTranslations();
    const queryClient = useQueryClient();
    const { handleError } = useApiNotify();

    const onSuccess = (
        data: any,
        { onSuccess }: CreateVariables<CreateYoutubeKeyPayload>
    ) => {
        queryClient.invalidateQueries({
            queryKey: youtubeKeysQueryKeys.lists(),
        });

        const responseMessages = messages(data?.data?.messageCode);

        onSuccess?.();
        showNotification('success', responseMessages);
    };

    const onError = (
        data: any,
        { onError }: CreateVariables<CreateYoutubeKeyPayload>
    ) => {
        onError?.();
        handleError(data);
    };

    const mutation = useMutation({
        mutationFn: ({ payload }: CreateVariables<CreateYoutubeKeyPayload>) =>
            youtubeKeysApi.create(payload),
        onSuccess,
        onError,
    });

    const createYoutubeKey = (
        variable: CreateVariables<CreateYoutubeKeyPayload>
    ) => {
        mutation.mutate(variable);
    };

    return {
        createYoutubeKey,
        ...mutation,
    };
};
