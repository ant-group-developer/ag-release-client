import { useApiError } from '@/hooks/use-api-error';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { rolesApis } from '../apis';
import { rolesQueryKeys } from '../constants/query-keys';
import { DeleteRoleProfile } from '../types/payload';

export const useDeleteRolePermission = () => {
    const queryClient = useQueryClient();
    const { handleError } = useApiError();

    const onSuccess = (data: any, { onSuccess }: DeleteRoleProfile) => {
        queryClient.invalidateQueries({
            queryKey: rolesQueryKeys.lists(),
        });

        // showNotification('success', messages(data.data.messageCode));
        onSuccess?.();
    };

    const onError = (data: any, { onError }: DeleteRoleProfile) => {
        handleError(data);

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
