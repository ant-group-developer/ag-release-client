import { showNotification } from '@/helpers/messages-helper';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { rolesApis } from '../apis';
import { rolesQueryKeys } from '../constants/query-keys';
import { DeleteRoleProfile } from '../types/payload';

export const useDeleteRolePermission = () => {
    const messages = useTranslations();
    const queryClient = useQueryClient();

    const onSuccess = (data: any, { onSuccess }: DeleteRoleProfile) => {
        queryClient.invalidateQueries({
            queryKey: rolesQueryKeys.lists(),
        });

        // showNotification('success', messages(data.data.messageCode));
        onSuccess?.();
    };

    const onError = (data: any, { onError }: DeleteRoleProfile) => {
        const responseMessages = messages(data?.response?.data?.messageCode);

        showNotification(
            'error',
            responseMessages ?? messages('common.somethingWentWrong')
        );
        onError?.();
    };

    const mutation = useMutation({
        mutationFn: ({ roleId, rolePermissionId }: DeleteRoleProfile) =>
            rolesApis.deleteRolePermission({ roleId, rolePermissionId }),
        onSuccess,
        onError,
    });

    const deleteRolePermission = (variables: DeleteRoleProfile) => {
        mutation.mutate(variables);
    };

    return {
        deleteRolePermission,
        ...mutation,
    };
};
