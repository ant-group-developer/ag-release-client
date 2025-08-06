import { showNotification } from '@/helpers/messages-helper';
import { useApiError } from '@/hooks/use-api-error';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { userApi } from '../api';
import { userQueryKeys } from '../constants';
import { UpdateUser } from '../types/data';

export const useUpdateUser = () => {
    const queryClient = useQueryClient();
    const messages = useTranslations();
    const { handleError } = useApiError();

    const onSuccess = (data: any, { onSuccess, userId }: UpdateUser) => {
        queryClient.invalidateQueries({
            queryKey: userQueryKeys.detail(userId),
        });
        queryClient.invalidateQueries({ queryKey: userQueryKeys.info() });
        queryClient.invalidateQueries({ queryKey: userQueryKeys.lists() });
        showNotification('success', messages('message.updateSuccessfully'));
        onSuccess?.();
    };

    const onError = (error: any, { onError }: UpdateUser) => {
        handleError(error);
        onError?.(error);
    };

    const mutation = useMutation({
        mutationFn: ({ payload, userId }: UpdateUser) =>
            userApi.update(userId, payload),
        onSuccess,
        onError,
    });

    const updateUser = (variables: UpdateUser) => {
        mutation.mutate(variables);
    };

    return { updateUser, ...mutation };
};
