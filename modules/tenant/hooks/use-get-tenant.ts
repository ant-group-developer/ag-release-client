import { DEFAULT_DATA_PAGINATION } from '@/constants/common';
import { PaginationResponse } from '@/types/api';
import { useQuery } from '@tanstack/react-query';
import { tenantApi } from '../api';
import { tenantQueryKeys } from '../constants';
import {
    DataFilterTenant,
    TenantData,
    TenantDetail,
    TenantDspData,
    TenantDspAgreementData,
} from '../types/data';

export function useTenantList(params: DataFilterTenant, enabled = true) {
    const { data, ...restResponse } = useQuery({
        queryKey: tenantQueryKeys.list(params),
        queryFn: () => tenantApi.getList(params),
        placeholderData: (previousData) => previousData,
        enabled,
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

export function useTenantDsp(id: string | null) {
    const { data, ...restResponse } = useQuery({
        queryKey: tenantQueryKeys.dsp(id ?? ''),
        queryFn: () => tenantApi.getDsp(id as string),
        enabled: Boolean(id),
    });

    return {
        ...restResponse,
        dataTenantDsp: data?.data?.data ?? ([] as TenantDspData[]),
    };
}

export function useGetTenantDspAgreements(id: string | null) {
    const { data, ...restResponse } = useQuery({
        queryKey: tenantQueryKeys.dspAgreement(id ?? ''),
        queryFn: () => tenantApi.getTenantDspAgreements(id as string),
        enabled: Boolean(id),
    });

    return {
        ...restResponse,
        dataTenantDspAgreement: data?.data?.data ?? ([] as TenantDspAgreementData[]),
    };
}

export function useGetTenantDspAgreementsUser() {
    const { data, ...restResponse } = useQuery({
        queryKey: tenantQueryKeys.dspAgreementsUser(),
        queryFn: () => tenantApi.getTenantDspAgreementsUser(),
    });

    return {
        ...restResponse,
        dataTenantDspAgreement: data?.data?.data ?? ([] as TenantDspAgreementData[]),
    };
}
