import { showNotification } from '@/helpers/messages-helper';
import { useApiNotify } from '@/hooks/use-api-notify';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { tenantApi } from '../api';
import { tenantQueryKeys } from '../constants';
import { DeleteTenantDomain } from '../types/data';

export function useDeleteTenantDomain() {
    const queryClient = useQueryClient();
    const messages = useTranslations();
    const { handleError } = useApiNotify();

    const onSuccess = (
        data: any,
        { onSuccess, tenantId }: DeleteTenantDomain
    ) => {
        queryClient.invalidateQueries({
            queryKey: tenantQueryKeys.detail(tenantId),
        });
        queryClient.invalidateQueries({
            queryKey: tenantQueryKeys.createDomain(tenantId),
        });
        queryClient.invalidateQueries({
            queryKey: tenantQueryKeys.getDomain(tenantId),
        });
        showNotification('success', messages('message.deleteSuccessfully'));
        onSuccess?.(data?.data?.data);
    };

    const onError = (error: any, { onError }: DeleteTenantDomain) => {
        handleError(error);
        onError?.(error);
    };

    const mutation = useMutation({
        mutationFn: ({ tenantId }: DeleteTenantDomain) =>
            tenantApi.deleteDomain(tenantId),
        onSuccess,
        onError,
        mutationKey: tenantQueryKeys.updates(),
    });

    const deleteTenantDomain = (variables: DeleteTenantDomain) => {
        return mutation.mutateAsync(variables);
    };

    return { deleteTenantDomain, ...mutation };
}
