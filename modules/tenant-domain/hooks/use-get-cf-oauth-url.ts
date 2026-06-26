import { useApiNotify } from '@/hooks/use-api-notify';
import { useMutation } from '@tanstack/react-query';
import { tenantDomainApi } from '../apis';

export function useGetCfOAuthUrl(tenantId: string) {
    const { handleError } = useApiNotify();

    return useMutation({
        mutationFn: () => tenantDomainApi.getCfOAuthUrl(tenantId),
        onError: handleError,
    });
}
