import { showNotification } from '@/helpers/messages-helper';
import { useApiNotify } from '@/hooks/use-api-notify';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { tenantApi } from '../api';
import { tenantQueryKeys } from '../constants';
import { VerifyTenantDomain } from '../types/data';

export function useVerifyTenantDomain() {
    const queryClient = useQueryClient();
    const messages = useTranslations();
    const { handleError } = useApiNotify();

    const onSuccess = (
        data: any,
        { onSuccess, tenantId }: VerifyTenantDomain
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
        showNotification('success', messages('message.updateSuccessfully'));
        onSuccess?.(data?.data?.data);
    };

    const onError = (error: any, { onError }: VerifyTenantDomain) => {
        handleError(error);
        onError?.(error);
    };

    const mutation = useMutation({
        mutationFn: ({ tenantId }: VerifyTenantDomain) =>
            tenantApi.verifyDomain(tenantId),
        onSuccess,
        onError,
        mutationKey: tenantQueryKeys.updates(),
    });

    const verifyTenantDomain = (variables: VerifyTenantDomain) => {
        return mutation.mutateAsync(variables);
    };

    return { verifyTenantDomain, ...mutation };
}
