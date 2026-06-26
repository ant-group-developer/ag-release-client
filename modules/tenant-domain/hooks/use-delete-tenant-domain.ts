import { showNotification } from '@/helpers/messages-helper';
import { useApiNotify } from '@/hooks/use-api-notify';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { tenantDomainApi } from '../apis';
import { tenantDomainQueryKeys } from '../constants/query-keys';

export function useDeleteTenantDomain(tenantId: string) {
    const queryClient = useQueryClient();
    const messages = useTranslations();
    const { handleError } = useApiNotify();

    return useMutation({
        mutationFn: () => tenantDomainApi.deleteDomain(tenantId),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: tenantDomainQueryKeys.detail(tenantId),
            });
            showNotification('success', messages('message.deleteSuccessfully'));
        },
        onError: handleError,
    });
}
