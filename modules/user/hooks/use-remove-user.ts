import { showNotification } from '@/helpers/messages-helper';
import { useApiNotify } from '@/hooks/use-api-notify';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { userApi } from '../api';
import { userQueryKeys } from '../constants';
import { RemoveUserData } from '../types/data';

export function useRemoveUser() {
    const queryClient = useQueryClient();
    const messages = useTranslations();
    const { handleError } = useApiNotify();

    const handleSuccess = (data: any, { onSuccess }: RemoveUserData) => {
        queryClient.invalidateQueries({
            queryKey: userQueryKeys.lists(),
        });
        showNotification('success', messages('message.deleteSuccessfully'));
        onSuccess?.();
    };

    const handleOnError = (error: any, { onError }: RemoveUserData) => {
        handleError(error);
        onError?.();
    };

    const mutation = useMutation({
        mutationFn: ({ userId }) => userApi.remove(userId),
        onSuccess: handleSuccess,
        onError: handleOnError,
    });

    const removeUser = (variables: RemoveUserData) => {
        mutation.mutate(variables);
    };

    return { ...mutation, removeUser };
}
