import { showNotification } from '@/helpers/messages-helper';
import { useApiNotify } from '@/hooks/use-api-notify';
import { DeleteVariables } from '@/types/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { permissionApis } from '../apis';
import { permissionQueryKeys } from '../constants/query-keys';
import { PermissionData } from '../types';

export const useDeletePermission = () => {
    const messages = useTranslations();
    const queryClient = useQueryClient();
    const { handleError } = useApiNotify();

    const onSuccess = (
        data: any,
        { onSuccess }: DeleteVariables<PermissionData['id']>
    ) => {
        queryClient.invalidateQueries({
            queryKey: permissionQueryKeys.lists(),
        });

        const responseMessages = messages(data?.data?.messageCode);

        onSuccess?.();
        showNotification('success', responseMessages);
    };

    const onError = (
        error: any,
        { onError }: DeleteVariables<PermissionData['id']>
    ) => {
        handleError(error);
        onError?.();
    };
    const mutation = useMutation({
        mutationFn: ({ id }: DeleteVariables<PermissionData['id']>) =>
            permissionApis.deletePermission(id),
        onSuccess,
        onError,
    });

    const deletePermission = (
        variables: DeleteVariables<PermissionData['id']>
    ) => {
        mutation.mutate(variables);
    };

    return {
        deletePermission,
        ...mutation,
    };
};
