import { showNotification } from '@/helpers/messages-helper';
import { useApiError } from '@/hooks/use-api-error';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { userApi } from '../api';
import { userQueryKeys } from '../constants';
import { CreateUser } from '../types/data';

export function useCreateUser() {
    const queryClient = useQueryClient();
    const messages = useTranslations();
    const { handleError } = useApiError();

    const handleOnSuccess = (data: any, { onSuccess }: CreateUser) => {
        queryClient.invalidateQueries({ queryKey: userQueryKeys.lists() });
        showNotification('success', messages('message.createSuccessfully'));
        onSuccess?.();
    };

    const handleOnError = (error: any, { onError }: CreateUser) => {
        handleError(error);
        onError?.();
    };

    const mutation = useMutation({
        mutationFn: ({ payload }: CreateUser) => userApi.create(payload),
        onSuccess: handleOnSuccess,
        onError: handleOnError,
    });

    const createUser = (variables: CreateUser) => {
        mutation.mutate(variables);
    };

    return { ...mutation, createUser };
}
