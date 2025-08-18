import { showNotification } from '@/helpers/messages-helper';
import { useApiError } from '@/hooks/use-api-error';
import { DeleteVariables } from '@/types/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { rolesApis } from '../apis';
import { rolesQueryKeys } from '../constants/query-keys';
import { RolesData } from '../types';

export const useDeleteRole = () => {
    const messages = useTranslations();
    const queryClient = useQueryClient();
    const { handleError } = useApiError();

    const onSuccess = (
        data: any,
        { onSuccess }: DeleteVariables<RolesData['id']>
    ) => {
        queryClient.invalidateQueries({
            queryKey: rolesQueryKeys.lists(),
        });

        const responseMessages = messages(data?.data?.messageCode);

        onSuccess?.();
        showNotification('success', responseMessages);
    };

    const onError = (
        error: any,
        { onError }: DeleteVariables<RolesData['id']>
    ) => {
        handleError(error);
        onError?.();
    };
    const mutation = useMutation({
        mutationFn: ({ id }: DeleteVariables<RolesData['id']>) =>
            rolesApis.deleteRole(id),
        onSuccess,
        onError,
    });

    const deleteRole = (variables: DeleteVariables<RolesData['id']>) => {
        mutation.mutate(variables);
    };

    return {
        deleteRole,
        ...mutation,
    };
};
