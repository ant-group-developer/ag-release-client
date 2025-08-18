import { showNotification } from '@/helpers/messages-helper';
import { useApiError } from '@/hooks/use-api-error';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { permissionApis } from '../apis';
import { permissionQueryKeys } from '../constants/query-keys';
import { BulkDeletePermission } from '../types/payload';

export const useBulkDeletePermission = () => {
    const messages = useTranslations();
    const queryClient = useQueryClient();
    const { handleError } = useApiError();

    const onSuccess = (data: any, { onSuccess }: BulkDeletePermission) => {
        queryClient.invalidateQueries({
            queryKey: permissionQueryKeys.lists(),
        });

        const responseMessages = messages(data?.data?.messageCode);

        onSuccess?.();
        showNotification('success', responseMessages);
    };

    const onError = (error: any, { onError }: BulkDeletePermission) => {
        handleError(error);
        onError?.();
    };
    const mutation = useMutation({
        mutationFn: ({ ids }: BulkDeletePermission) =>
            permissionApis.bulkDeletePermission(ids),
        onSuccess,
        onError,
    });

    const bulkDeletePermission = (variables: BulkDeletePermission) => {
        mutation.mutate(variables);
    };

    return {
        bulkDeletePermission,
        ...mutation,
    };
};
