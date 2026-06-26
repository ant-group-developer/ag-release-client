import { useQuery } from '@tanstack/react-query';
import { tenantDomainApi } from '../apis';
import { tenantDomainQueryKeys } from '../constants/query-keys';
import { GetDomainResponse } from '../types';

export function useGetTenantDomain(tenantId: string | null) {
    const { data, ...rest } = useQuery({
        queryKey: tenantDomainQueryKeys.detail(tenantId ?? ''),
        queryFn: () => tenantDomainApi.getDetail(tenantId as string),
        enabled: Boolean(tenantId),
        retry: false,
    });

    return {
        ...rest,
        domainData: (data?.data?.data ?? null) as GetDomainResponse | null,
    };
}
