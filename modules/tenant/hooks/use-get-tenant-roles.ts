import { useQuery } from '@tanstack/react-query';
import { tenantApi } from '../api';
import { tenantQueryKeys } from '../constants';
import { TenantRoleData } from '../types/data';

export function useTenantRoles(id: string | null) {
    const { data, ...restResponse } = useQuery({
        queryKey: tenantQueryKeys.tenantRoles(id ?? ''),
        queryFn: () => tenantApi.getRoles(id as string),
        enabled: Boolean(id),
    });

    return {
        ...restResponse,
        dataTenantRoles: data?.data?.data ?? ([] as string[]),
    };
}
