import { DEFAULT_DATA_PAGINATION } from '@/constants/common';
import { PaginationResponse } from '@/types/api';
import { useQuery } from '@tanstack/react-query';
import { tenantApi } from '../api';
import { tenantQueryKeys } from '../constants';
import { DataFilterTenant, TenantData, TenantDetail } from '../types/data';

export function useTenantList(params: DataFilterTenant) {
    const { data, ...restResponse } = useQuery({
        queryKey: tenantQueryKeys.list(params),
        queryFn: () => tenantApi.getList(params),
        placeholderData: (previousData) => previousData,
    });

    return {
        ...restResponse,
        data:
            data?.data?.data ??
            (DEFAULT_DATA_PAGINATION as PaginationResponse<TenantData>['data']),
    };
}

export function useTenantActive() {
    const { data, ...restResponse } = useQuery({
        queryKey: tenantQueryKeys.active(),
        queryFn: () => tenantApi.getActive(),
        placeholderData: (previousData) => previousData,
    });

    return {
        ...restResponse,
        data:
            data?.data?.data ??
            (DEFAULT_DATA_PAGINATION as PaginationResponse<TenantData>['data']),
    };
}

export function useTenantDetail(id: string | null) {
    const { data, ...restResponse } = useQuery({
        queryKey: tenantQueryKeys.detail(id ?? ''),
        queryFn: () => tenantApi.getDetail(id as string),
        enabled: Boolean(id),
    });

    return {
        ...restResponse,
        dataTenant: data?.data?.data ?? ({} as TenantDetail),
    };
}
