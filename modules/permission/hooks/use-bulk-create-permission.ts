import { showNotification } from '@/helpers/messages-helper';
import { useApiError } from '@/hooks/use-api-error';
import { CreateVariables } from '@/types/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { permissionApis } from '../apis';
import { permissionQueryKeys } from '../constants/query-keys';
import { BulkCreatePermissionPayload } from '../types/payload';

export const useBulkCreatePermission = () => {
    const messages = useTranslations();
    const queryClient = useQueryClient();
    const { handleError } = useApiError();

    const onSuccess = (
        data: any,
        { onSuccess }: CreateVariables<BulkCreatePermissionPayload>
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
        { onError }: CreateVariables<BulkCreatePermissionPayload>
    ) => {
        handleError(data);
        onError?.();
    };

    const mutation = useMutation({
        mutationFn: ({
            payload,
        }: CreateVariables<BulkCreatePermissionPayload>) =>
            permissionApis.bulkCreatePermission(payload),
        onSuccess,
        onError,
    });

    const bulkCreatePermission = (
        variables: CreateVariables<BulkCreatePermissionPayload>
    ) => {
        mutation.mutate(variables);
    };

    return {
        bulkCreatePermission,
        ...mutation,
    };
};
