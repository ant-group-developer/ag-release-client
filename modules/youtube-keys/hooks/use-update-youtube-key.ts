import { showNotification } from '@/helpers/messages-helper';
import { useApiNotify } from '@/hooks/use-api-notify';
import { UpdateVariables } from '@/types/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { youtubeKeysApi } from '../apis';
import { youtubeKeysQueryKeys } from '../constants/query-keys';
import { UpdateYoutubeKeyPayload } from '../types';

export const useUpdateYoutubeKey = () => {
    const messages = useTranslations();
    const queryClient = useQueryClient();
    const { handleError } = useApiNotify();

    const onSuccess = (
        data: any,
        { onSuccess, id }: UpdateVariables<string | number, UpdateYoutubeKeyPayload>
    ) => {
        queryClient.invalidateQueries({
            queryKey: youtubeKeysQueryKeys.lists(),
        });
        if (id) {
            queryClient.invalidateQueries({
                queryKey: youtubeKeysQueryKeys.detail(id),
            });
        }

        const responseMessages = messages(data?.data?.messageCode);

        onSuccess?.();
        showNotification('success', responseMessages);
    };

    const onError = (
        data: any,
        { onError }: UpdateVariables<string | number, UpdateYoutubeKeyPayload>
    ) => {
        onError?.();
        handleError(data);
    };

    const mutation = useMutation({
        mutationFn: ({ id, payload }: UpdateVariables<string | number, UpdateYoutubeKeyPayload>) =>
            youtubeKeysApi.update(id, payload),
        onSuccess,
        onError,
    });

    const updateYoutubeKey = (
        variable: UpdateVariables<string | number, UpdateYoutubeKeyPayload>
    ) => {
        mutation.mutate(variable);
    };

    return {
        updateYoutubeKey,
        ...mutation,
    };
};
