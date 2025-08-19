import { showNotification } from '@/helpers/messages-helper';
import { useApiError } from '@/hooks/use-api-error';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { rolesApis } from '../apis';
import { rolesQueryKeys } from '../constants/query-keys';
import { BulkDeleteRoles } from '../types/payload';

export const useBulkDeleteRoles = () => {
    const messages = useTranslations();
    const queryClient = useQueryClient();
    const { handleError } = useApiError();

    const onSuccess = (data: any, { onSuccess }: BulkDeleteRoles) => {
        queryClient.invalidateQueries({
            queryKey: rolesQueryKeys.lists(),
        });

        const responseMessages = messages(data?.data?.messageCode);

        onSuccess?.();
        showNotification('success', responseMessages);
    };

    const onError = (error: any, { onError }: BulkDeleteRoles) => {
        handleError(error);
        onError?.();
    };
    const mutation = useMutation({
        mutationFn: ({ ids }: BulkDeleteRoles) =>
            rolesApis.bulkDeleteRoles(ids),
        onSuccess,
        onError,
    });

    const bulkDeleteRoles = (variables: BulkDeleteRoles) => {
        mutation.mutate(variables);
    };

    return {
        bulkDeleteRoles,
        ...mutation,
    };
};
