import { useQuery } from '@tanstack/react-query';
import { tenantApi } from '../api';
import { tenantQueryKeys } from '../constants';
import { DomainResolveResponse } from '../types/data';

export function useResolveDomain(domain: string, enabled = true) {
    const { data, ...restResponse } = useQuery({
        queryKey: tenantQueryKeys.resolveDomain(domain),
        queryFn: () => tenantApi.resolveDomain({ domain }),
        enabled: Boolean(domain) && enabled,
        refetchOnMount: false,
    });

    return {
        ...restResponse,
        domainData: data?.data?.data ?? (null as DomainResolveResponse | null),
    };
}
