import { showNotification } from '@/helpers/messages-helper';
import { useApiNotify } from '@/hooks/use-api-notify';
import { UpdateVariables } from '@/types/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { rolesApis } from '../apis';
import { rolesQueryKeys } from '../constants/query-keys';
import { RolesData } from '../types';
import { UpdateRolesPayload } from '../types/payload';

export const useUpdateRole = () => {
    const messages = useTranslations();
    const queryClient = useQueryClient();
    const { handleError } = useApiNotify();
    const onSuccess = (
        data: any,
        { onSuccess }: UpdateVariables<RolesData['id'], UpdateRolesPayload>
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
        { onError }: UpdateVariables<RolesData['id'], UpdateRolesPayload>
    ) => {
        onError?.();
        handleError(error);
    };
    const mutation = useMutation({
        mutationFn: ({
            id,
            payload,
        }: UpdateVariables<RolesData['id'], UpdateRolesPayload>) =>
            rolesApis.updateRoles(id, payload),
        onSuccess,
        onError,
    });

    const updateRole = (
        variables: UpdateVariables<RolesData['id'], UpdateRolesPayload>
    ) => {
        mutation.mutate(variables);
    };

    return {
        updateRole,
        ...mutation,
    };
};
