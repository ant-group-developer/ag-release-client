import { useQuery } from '@tanstack/react-query';
import { tenantApi } from '../api';
import { tenantQueryKeys } from '../constants';

export function useGetCfOAuthUrl(
    tenantId: string,
    options?: { enabled?: boolean }
) {
    return useQuery({
        queryKey: tenantQueryKeys.getCfOAuthUrl(tenantId),
        queryFn: () => tenantApi.getCfOAuthUrl(tenantId),
        enabled: !!tenantId && options?.enabled !== false,
    });
}
