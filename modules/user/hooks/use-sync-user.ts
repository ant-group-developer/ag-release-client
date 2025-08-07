import { showNotification } from '@/helpers/messages-helper';
import { useApiError } from '@/hooks/use-api-error';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { userApi } from '../api';
import { userQueryKeys } from '../constants';
import { SyncUserData } from '../types/data';

export function useSyncUser() {
    const queryClient = useQueryClient();
    const messages = useTranslations();
    const { handleError } = useApiError();

    const handleSuccess = (data: any, { onSuccess }: SyncUserData) => {
        queryClient.invalidateQueries({
            queryKey: userQueryKeys.lists(),
        });
        showNotification('success', messages('message.updateSuccessfully'));
        onSuccess?.();
    };

    const handleOnError = (error: any, { onError }: SyncUserData) => {
        handleError(error);
        onError?.();
    };

    const mutation = useMutation({
        mutationFn: () => userApi.syncData(),
        onSuccess: handleSuccess,
        onError: handleOnError,
    });

    const syncUser = (variables: SyncUserData) => {
        mutation.mutate(variables);
    };

    return { ...mutation, syncUser };
}
