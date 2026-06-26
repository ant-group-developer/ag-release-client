import { useApiNotify } from '@/hooks/use-api-notify';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { tenantDomainApi } from '../apis';
import { tenantDomainQueryKeys } from '../constants/query-keys';

export function useVerifyTenantDomain(tenantId: string) {
    const queryClient = useQueryClient();
    const { handleError } = useApiNotify();

    return useMutation({
        mutationFn: () => tenantDomainApi.verify(tenantId),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: tenantDomainQueryKeys.detail(tenantId),
            });
        },
        onError: handleError,
    });
}
