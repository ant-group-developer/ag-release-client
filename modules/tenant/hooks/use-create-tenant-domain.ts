import { showNotification } from '@/helpers/messages-helper';
import { useApiNotify } from '@/hooks/use-api-notify';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { tenantApi } from '../api';
import { tenantQueryKeys } from '../constants';
import { CreateTenantDomain } from '../types/data';

export function useCreateTenantDomain() {
    const queryClient = useQueryClient();
    const messages = useTranslations();
    const { handleError } = useApiNotify();

    const onSuccess = (
        data: any,
        { onSuccess, tenantId }: CreateTenantDomain
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
        showNotification('success', messages('message.createSuccessfully'));
        onSuccess?.(data?.data?.data);
    };

    const onError = (error: any, { onError }: CreateTenantDomain) => {
        handleError(error);
        onError?.(error);
    };

    const mutation = useMutation({
        mutationFn: ({ tenantId, payload }: CreateTenantDomain) =>
            tenantApi.createDomain(tenantId, payload),
        onSuccess,
        onError,
        mutationKey: tenantQueryKeys.creates(),
    });

    const createTenantDomain = (variables: CreateTenantDomain) => {
        return mutation.mutateAsync(variables);
    };

    return { createTenantDomain, ...mutation };
}
