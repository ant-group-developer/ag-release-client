import { showNotification } from '@/helpers/messages-helper';
import { useApiError } from '@/hooks/use-api-error';
import { CreateVariables } from '@/types/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { permissionApis } from '../apis';
import { permissionQueryKeys } from '../constants/query-keys';
import { CreatePermissionPayload } from '../types/payload';

export const useCreatePermission = () => {
    const messages = useTranslations();
    const queryClient = useQueryClient();
    const { handleError } = useApiError();

    const onSuccess = (
        data: any,
        { onSuccess }: CreateVariables<CreatePermissionPayload>
    ) => {
        queryClient.invalidateQueries({
            queryKey: permissionQueryKeys.lists(),
        });
        const responseMessages = messages(data?.data?.messageCode);
        onSuccess?.();
        showNotification('success', responseMessages);
    };

    const onError = (
        data: any,
        { onError }: CreateVariables<CreatePermissionPayload>
    ) => {
        handleError(data);
        onError?.();
    };

    const mutation = useMutation({
        mutationFn: ({ payload }: CreateVariables<CreatePermissionPayload>) =>
            permissionApis.createPermission(payload),
        onSuccess,
        onError,
    });

    const createPermission = (
        variables: CreateVariables<CreatePermissionPayload>
    ) => {
        mutation.mutate(variables);
    };

    return {
        createPermission,
        ...mutation,
    };
};
