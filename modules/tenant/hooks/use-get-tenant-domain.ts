import { useQuery } from '@tanstack/react-query';
import { tenantApi } from '../api';
import { tenantQueryKeys } from '../constants';

export function useGetTenantDomain(tenantId: string) {
    return useQuery({
        queryKey: tenantQueryKeys.getDomain(tenantId),
        queryFn: () => tenantApi.getDomain(tenantId),
        enabled: !!tenantId,
    });
}
