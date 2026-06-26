import { showNotification } from '@/helpers/messages-helper';
import { useApiNotify } from '@/hooks/use-api-notify';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { tenantDomainApi } from '../apis';
import { tenantDomainQueryKeys } from '../constants/query-keys';
import { RegisterDomainPayload } from '../types/payload';

export function useRegisterTenantDomain(tenantId: string) {
    const queryClient = useQueryClient();
    const messages = useTranslations();
    const { handleError } = useApiNotify();

    return useMutation({
        mutationFn: (payload: RegisterDomainPayload) =>
            tenantDomainApi.register(tenantId, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: tenantDomainQueryKeys.detail(tenantId),
            });
            showNotification('success', messages('message.createSuccessfully'));
        },
        onError: handleError,
    });
}
