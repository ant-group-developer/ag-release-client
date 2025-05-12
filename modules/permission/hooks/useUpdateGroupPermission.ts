import { showNotification } from '@/helpers/messages-helper';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { permissionApi } from '../api';
import { permissionQueryKeys } from '../constants';
import { UpdateGroupPermission } from '../types/update';

export function useUpdateGroupPermission() {
    const queryClient = useQueryClient();
    const messages = useTranslations();

    const handleSuccess = (
        data: any,
        { onSuccess, groupId }: UpdateGroupPermission
    ) => {
        queryClient.invalidateQueries({
            queryKey: [...permissionQueryKeys.getGroupPermission, groupId],
        });
        showNotification('success', messages('message.updateSuccessfully'));
        onSuccess?.();
    };

    const handleOnError = (data: any, { onError }: UpdateGroupPermission) => {
        showNotification('error', messages(data?.response.data.message));
        onError?.();
    };

    const mutation = useMutation({
        mutationFn: ({ groupId, payload }: UpdateGroupPermission) =>
            permissionApi.updateGroupPermission(groupId, payload),
        onSuccess: handleSuccess,
        onError: handleOnError,
    });

    const updateGroupPermission = (variables: UpdateGroupPermission) => {
        mutation.mutate(variables);
    };

    return { ...mutation, updateGroupPermission };
}
