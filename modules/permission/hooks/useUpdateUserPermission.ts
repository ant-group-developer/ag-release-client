import { showNotification } from '@/helpers/messages-helper';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { permissionApi } from '../api';
import { permissionQueryKeys } from '../constants';
import { UpdateUserPermission } from '../types/update';

export function useUpdateUserPermission() {
    const queryClient = useQueryClient();
    const messages = useTranslations();

    const handleSuccess = (
        data: any,
        { onSuccess, userId }: UpdateUserPermission
    ) => {
        queryClient.invalidateQueries({
            queryKey: [...permissionQueryKeys.getUserPermission, userId],
        });
        showNotification('success', messages('message.updateSuccessfully'));
        onSuccess?.();
    };

    const handleOnError = (data: any, { onError }: UpdateUserPermission) => {
        showNotification('error', messages(data?.response.data.message));
        onError?.();
    };

    const mutation = useMutation({
        mutationFn: ({ userId, payload }: UpdateUserPermission) =>
            permissionApi.updateUserPermission(userId, payload),
        onSuccess: handleSuccess,
        onError: handleOnError,
    });

    const updateUserPermission = (variables: UpdateUserPermission) => {
        mutation.mutate(variables);
    };

    return { ...mutation, updateUserPermission };
}
