import { showNotification } from '@/helpers/messages-helper';
import { useApiError } from '@/hooks/use-api-error';
import { UpdateVariables } from '@/types/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { permissionApis } from '../apis';
import { permissionQueryKeys } from '../constants/query-keys';
import { PermissionData } from '../types';
import { UpdatePermissionPayload } from '../types/payload';

export const useUpdatePermission = () => {
    const messages = useTranslations();
    const queryClient = useQueryClient();
    const { handleError } = useApiError();
    const onSuccess = (
        data: any,
        {
            onSuccess,
        }: UpdateVariables<PermissionData['id'], UpdatePermissionPayload>
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
        {
            onError,
        }: UpdateVariables<PermissionData['id'], UpdatePermissionPayload>
    ) => {
        onError?.();
        handleError(error);
    };
    const mutation = useMutation({
        mutationFn: ({
            id,
            payload,
        }: UpdateVariables<PermissionData['id'], UpdatePermissionPayload>) =>
            permissionApis.updatePermission(id, payload),
        onSuccess,
        onError,
    });

    const updatePermission = (
        variables: UpdateVariables<
            PermissionData['id'],
            UpdatePermissionPayload
        >
    ) => {
        mutation.mutate(variables);
    };

    return {
        updatePermission,
        ...mutation,
    };
};
